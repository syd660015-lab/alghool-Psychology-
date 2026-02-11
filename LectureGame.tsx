
import React, { useState, useEffect, useRef } from 'react';
import { LectureGame, GamePair, QuickQuestion } from '../types';

interface LectureGameProps {
  game: LectureGame;
}

type GameMode = 'select' | 'matching' | 'quick-qa';

const LectureGameView: React.FC<LectureGameProps> = ({ game }) => {
  const [mode, setMode] = useState<GameMode>('select');
  const [shuffledTerms, setShuffledTerms] = useState<GamePair[]>([]);
  const [shuffledDescs, setShuffledDescs] = useState<GamePair[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Quick QA States
  const [qaIndex, setQaIndex] = useState(0);
  const [qaTimer, setQaTimer] = useState(10);
  const [qaFeedback, setQaFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    resetGame();
    return () => stopTimer();
  }, [game, mode]);

  const resetGame = () => {
    setShuffledTerms([...game.pairs].sort(() => Math.random() - 0.5));
    setShuffledDescs([...game.pairs].sort(() => Math.random() - 0.5));
    setMatches([]);
    setIsFinished(false);
    setSelectedTerm(null);
    setScore(0);
    setSeconds(0);
    setIsActive(false);
    setQaIndex(0);
    setQaTimer(10);
    setQaFeedback(null);
    setShowExplanation(false);
    stopTimer();
  };

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
        if (mode === 'quick-qa' && !showExplanation) {
          setQaTimer(prev => {
            if (prev <= 1) {
              handleAnswer(false); // Time out acts as a wrong answer
              return 10;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + (qaTimer * 10)); // Speed bonus
      setQaFeedback('correct');
    } else {
      setScore(prev => Math.max(0, prev - 20));
      setQaFeedback('wrong');
    }
    setShowExplanation(true);
    // Timer is paused while showing explanation (effectively by the logic in setInterval)
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setQaFeedback(null);
    if (game.quickQA && qaIndex < game.quickQA.length - 1) {
      setQaIndex(prev => prev + 1);
      setQaTimer(10);
    } else {
      setIsFinished(true);
      stopTimer();
    }
  };

  const handleTermClick = (id: string) => {
    if (matches.includes(id) || isFinished) return;
    startTimer();
    setSelectedTerm(id);
    setError(null);
  };

  const handleDescClick = (id: string) => {
    if (!selectedTerm || matches.includes(id) || isFinished) return;

    if (selectedTerm === id) {
      const newMatches = [...matches, id];
      setMatches(newMatches);
      setSelectedTerm(null);
      setScore(prev => prev + 50);
      
      if (newMatches.length === game.pairs.length) {
        setIsFinished(true);
        stopTimer();
      }
    } else {
      setError(id);
      setScore(prev => Math.max(0, prev - 15));
      setTimeout(() => setError(null), 500);
    }
  };

  if (mode === 'select') {
    return (
      <div className="bg-indigo-50/30 rounded-[3rem] p-12 border-2 border-indigo-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="text-6xl mb-6">🎮</div>
        <h3 className="text-3xl font-black text-indigo-950 mb-4">اختر تحدي المحاضرة</h3>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">اختر نوع النشاط الذي تفضله لمراجعة وتثبيت المعلومات التي تعلمتها في هذه الوحدة.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button 
            onClick={() => setMode('matching')}
            className="group bg-white p-8 rounded-[2rem] border-2 border-white hover:border-indigo-600 transition-all shadow-xl hover:shadow-indigo-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">🧩</div>
            <h4 className="text-xl font-black text-indigo-900 mb-2">مطابقة المفاهيم</h4>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">قم بتوصيل المصطلحات العلمية بأمثلتها وتفسيراتها الصحيحة.</p>
          </button>
          <button 
            onClick={() => setMode('quick-qa')}
            className="group bg-white p-8 rounded-[2rem] border-2 border-white hover:border-indigo-600 transition-all shadow-xl hover:shadow-indigo-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">⚡</div>
            <h4 className="text-xl font-black text-indigo-900 mb-2">الأسئلة السريعة</h4>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">تحدي السرعة في الإجابة على أسئلة مفاهيمية في وقت محدود.</p>
          </button>
        </div>
      </div>
    );
  }

  const currentQA = game.quickQA?.[qaIndex];

  return (
    <div className="bg-indigo-50/30 rounded-[3rem] p-8 md:p-12 border-2 border-indigo-100 shadow-inner relative overflow-hidden min-h-[550px] flex flex-col">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 relative z-10">
        <div className="text-right">
          <button 
            onClick={() => setMode('select')}
            className="inline-block px-4 py-1 bg-white border border-indigo-100 text-indigo-400 rounded-full text-[10px] font-black mb-3 uppercase tracking-tighter hover:bg-indigo-50 transition"
          >
            ← تغيير اللعبة
          </button>
          <h3 className="text-3xl font-black text-indigo-950 mb-1">
            {mode === 'matching' ? game.title : 'تحدي الأسئلة السريعة'}
          </h3>
          <p className="text-indigo-600 font-bold text-sm">
            {mode === 'matching' ? game.instruction : 'أجب بسرعة قبل نفاد الوقت لتحصل على نقاط مضاعفة!'}
          </p>
        </div>

        <div className="flex gap-4">
          <div className={`px-6 py-3 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center min-w-[100px] transition-colors ${mode === 'quick-qa' && qaTimer < 4 && !showExplanation ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white'}`}>
            <span className="text-[10px] font-black text-gray-400 uppercase">{mode === 'quick-qa' ? 'العداد' : 'الوقت'}</span>
            <span className={`text-2xl font-black tabular-nums ${mode === 'quick-qa' && qaTimer < 4 && !showExplanation ? 'text-red-600' : 'text-indigo-600'}`}>
              {mode === 'quick-qa' ? qaTimer : formatTime(seconds)}
            </span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-indigo-50 flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-gray-400 uppercase">النقاط</span>
            <span className="text-2xl font-black text-green-600 tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col justify-center">
        {mode === 'matching' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="text-center text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">اختر المصطلح</div>
              {shuffledTerms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleTermClick(p.id)}
                  disabled={matches.includes(p.id)}
                  className={`w-full p-5 rounded-[1.5rem] border-2 transition-all font-black text-center relative group ${
                    matches.includes(p.id)
                      ? 'bg-green-50 border-green-200 text-green-700 opacity-50 cursor-default'
                      : selectedTerm === p.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105 z-20'
                      : 'bg-white border-white hover:border-indigo-100 text-indigo-900 shadow-md hover:shadow-lg'
                  }`}
                >
                  <span className="relative z-10">{p.term}</span>
                  {matches.includes(p.id) && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">✅</div>}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="text-center text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">طابق مع الوصف</div>
              {shuffledDescs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleDescClick(p.id)}
                  disabled={matches.includes(p.id)}
                  className={`w-full p-5 rounded-[1.5rem] border-2 transition-all text-sm font-bold leading-relaxed text-right relative min-h-[80px] flex items-center justify-end ${
                    matches.includes(p.id)
                      ? 'bg-green-50 border-green-200 text-green-700 opacity-50 cursor-default'
                      : error === p.id
                      ? 'bg-red-100 border-red-500 text-red-700 animate-shake ring-4 ring-red-100'
                      : 'bg-white border-white hover:border-indigo-100 text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <span className="flex-1 ml-4">{p.description}</span>
                  {error === p.id && <div className="absolute -top-3 -left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg font-black shadow-lg">-15</div>}
                  {matches.includes(p.id) && <div className="text-green-500 text-xl font-black">+50</div>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full">
            {isActive ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-3">
                  <div className="text-xs font-black text-indigo-300 uppercase tracking-widest">سؤال {qaIndex + 1} من {game.quickQA?.length}</div>
                  <h4 className="text-2xl md:text-3xl font-black text-indigo-950 leading-tight">
                    {currentQA?.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentQA?.options.map((opt, i) => {
                    const isCorrect = i === currentQA.correctAnswer;
                    const isSelectedFeedback = qaFeedback !== null;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(isCorrect)}
                        disabled={isSelectedFeedback}
                        className={`w-full p-5 rounded-[1.5rem] border-2 font-black text-lg transition-all relative overflow-hidden text-right ${
                          !isSelectedFeedback
                            ? 'bg-white border-white hover:border-indigo-600 text-indigo-900 shadow-md'
                            : isCorrect
                            ? 'bg-green-500 border-green-500 text-white scale-102 z-10'
                            : qaFeedback === 'wrong'
                            ? 'bg-red-100 border-red-100 text-red-300 opacity-50'
                            : 'bg-white border-white opacity-20'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && currentQA && (
                  <div className="bg-white p-6 rounded-[2rem] border-r-8 border-indigo-500 shadow-lg animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{qaFeedback === 'correct' ? '🌟' : '💡'}</span>
                      <h5 className="font-black text-indigo-900 text-lg">التفسير العلمي:</h5>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {currentQA.explanation}
                    </p>
                    <button 
                      onClick={nextQuestion}
                      className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                    >
                      {qaIndex < (game.quickQA?.length || 0) - 1 ? 'السؤال التالي ←' : 'عرض النتيجة النهائية 🏆'}
                    </button>
                  </div>
                )}

                {!showExplanation && (
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${qaTimer < 4 ? 'bg-red-500' : 'bg-indigo-600'}`}
                      style={{ width: `${(qaTimer / 10) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-8">
                <div className="text-8xl animate-bounce">⚡</div>
                <h4 className="text-4xl font-black text-indigo-950">تحدي الذاكرة والسرعة</h4>
                <p className="text-gray-500 font-bold max-w-sm mx-auto">أجب على الأسئلة في أقل وقت ممكن. سيتم عرض تفسير علمي لكل إجابة لمساعدتك على التعلم.</p>
                <button 
                  onClick={startTimer}
                  className="bg-orange-500 text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-xl shadow-orange-100 hover:scale-110 active:scale-95 transition-all"
                >
                  ابدأ الآن 🚀
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isFinished && (
        <div className="absolute inset-0 flex items-center justify-center z-30 animate-in fade-in zoom-in duration-500 bg-indigo-900/10 backdrop-blur-sm -m-8 md:-m-12">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-600 text-center max-w-md mx-6 relative">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-6xl shadow-2xl border-8 border-white animate-bounce">
              🏆
            </div>
            <div className="pt-12 space-y-4">
              <h4 className="text-4xl font-black text-indigo-950">إنجاز رائع!</h4>
              <p className="text-gray-500 font-bold mb-8 text-lg">لقد أكملت النشاط بنجاح وطورت فهمك للقوى الدينامية.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <div className="text-xs font-black text-indigo-400 uppercase mb-1">النقاط النهائية</div>
                  <div className="text-3xl font-black text-indigo-600">{score}</div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <div className="text-xs font-black text-indigo-400 uppercase mb-1">الوقت</div>
                  <div className="text-3xl font-black text-indigo-600">{mode === 'matching' ? formatTime(seconds) : `${game.quickQA?.length} أسئلة`}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={resetGame}
                  className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
                >
                  إعادة 🔄
                </button>
                <button 
                  onClick={() => setMode('select')}
                  className="flex-1 bg-white border-2 border-indigo-100 text-indigo-600 py-5 rounded-2xl font-black text-lg hover:bg-indigo-50 transition"
                >
                  الرجوع 🎮
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'matching' && !isActive && !isFinished && (
        <div className="mt-8 text-center animate-pulse relative z-10">
          <span className="text-indigo-400 font-bold text-xs">اضغط على أي مصطلح لبدء التحدي والعداد الزمني...</span>
        </div>
      )}
    </div>
  );
};

export default LectureGameView;
