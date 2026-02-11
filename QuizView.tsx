
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';

interface QuizViewProps {
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (isSubmitted && !showReview) {
    const score = calculateScore();
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-50 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="text-7xl mb-6 drop-shadow-lg">
            {percentage >= 80 ? '🎓' : percentage >= 50 ? '👏' : '📚'}
          </div>
          <h2 className="text-4xl font-black text-indigo-900 mb-2">نتيجة الاختبار</h2>
          <p className="text-gray-500 font-medium">أداء متميز في رحلة تعلم علم النفس الدينامي</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl mb-10 border border-white shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-indigo-900">الدرجة النهائية:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-indigo-600">{score}</span>
              <span className="text-indigo-300 font-bold">/ {QUIZ_QUESTIONS.length}</span>
            </div>
          </div>
          <div className="w-full bg-white/50 h-5 rounded-full overflow-hidden p-1 shadow-inner border border-white">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${percentage >= 50 ? 'bg-indigo-600' : 'bg-orange-500'}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="mt-4 text-center text-sm font-bold text-indigo-700">
            {percentage === 100 ? "ممتاز! استيعاب كامل للمقرر." : "خطوة جيدة، راجع التفسيرات لتعزيز فهمك."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => {
              setShowReview(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 group"
          >
            <span>مراجعة الإجابات والتفسيرات العلمية</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setIsSubmitted(false);
                setShowReview(false);
              }}
              className="py-4 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition"
            >
              إعادة الاختبار
            </button>
            <button 
              onClick={onBack}
              className="py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition"
            >
              العودة للمقرر
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-lg sticky top-24 z-10 border border-indigo-100 backdrop-blur-md bg-white/90">
          <div>
            <h2 className="text-2xl font-black text-indigo-900">مراجعة وتحليل النتائج</h2>
            <p className="text-gray-500 text-sm font-bold">اطلع على التفسيرات العلمية لكل إجابة</p>
          </div>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setShowReview(false);
              setSelectedAnswers({});
            }}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            اختبار جديد
          </button>
        </div>

        {QUIZ_QUESTIONS.map((q, idx) => {
          const userAnswer = selectedAnswers[idx];
          const isCorrect = userAnswer === q.correctAnswer;
          
          return (
            <div key={idx} className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all ${
              isCorrect ? 'border-green-50 shadow-green-50/50' : 'border-red-50 shadow-red-50/50'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-sm ${
                    isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 pt-1 leading-relaxed">
                    {q.text}
                  </h3>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-8 mr-16">
                {q.options.map((option, optIdx) => {
                  const isCorrectOption = optIdx === q.correctAnswer;
                  const isUserSelection = optIdx === userAnswer;
                  
                  let cardStyle = "bg-gray-50 border-gray-100 text-gray-400";
                  if (isCorrectOption) cardStyle = "bg-green-50 border-green-200 text-green-800 font-bold ring-2 ring-green-500/20";
                  if (isUserSelection && !isCorrect) cardStyle = "bg-red-50 border-red-200 text-red-800 font-bold";

                  return (
                    <div key={optIdx} className={`p-4 rounded-2xl border-2 flex items-center justify-between ${cardStyle}`}>
                      <span>{option}</span>
                      <div className="flex items-center gap-2">
                        {isCorrectOption && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-md font-black">الجواب الصحيح</span>}
                        {isUserSelection && !isCorrect && <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-md font-black">اختيارك</span>}
                        {isUserSelection && isCorrect && <span className="text-green-600">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`mr-16 p-6 rounded-[2rem] border-r-8 ${
                isCorrect ? 'bg-green-50/50 border-green-500' : 'bg-indigo-50/50 border-indigo-500'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{isCorrect ? '🌟' : '💡'}</span>
                  <h4 className={`font-black text-lg ${isCorrect ? 'text-green-800' : 'text-indigo-900'}`}>
                    {isCorrect ? 'تحليل النجاح:' : 'لماذا هذه هي الإجابة؟'}
                  </h4>
                </div>
                <p className={`leading-relaxed text-lg font-medium ${isCorrect ? 'text-green-700' : 'text-indigo-800/80'}`}>
                  {q.explanation}
                </p>
                {!isCorrect && (
                  <div className="mt-4 pt-4 border-t border-indigo-100 text-sm font-bold text-indigo-500">
                    نصيحة: ركز على مفهوم "{q.options[q.correctAnswer]}" في مراجعتك القادمة.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button 
          onClick={onBack}
          className="w-full py-6 bg-white border-2 border-indigo-100 text-indigo-600 font-black rounded-3xl hover:bg-indigo-50 transition shadow-lg"
        >
          العودة للمقرر الدراسي الرئيسي
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-200">
            {currentQuestionIndex + 1}
          </div>
          <div className="flex flex-col">
             <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">السؤال الحالي</span>
             <span className="text-gray-400 text-sm font-bold">{currentQuestionIndex + 1} من {QUIZ_QUESTIONS.length}</span>
          </div>
        </div>
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h3 className="text-2xl font-black text-gray-900 mb-10 leading-relaxed min-h-[5rem]">
        {currentQuestion.text}
      </h3>

      <div className="space-y-4 mb-12">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-right p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
              selectedAnswers[currentQuestionIndex] === idx
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-lg shadow-indigo-100'
                : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className="flex-1 font-bold text-lg relative z-10">{option}</span>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all relative z-10 ${
              selectedAnswers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-gray-200 bg-white'
            }`}>
              {selectedAnswers[currentQuestionIndex] === idx && (
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              )}
            </div>
            {selectedAnswers[currentQuestionIndex] === idx && (
              <div className="absolute inset-y-0 right-0 w-2 bg-indigo-600"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <span>السؤال التالي</span>
          </button>
        ) : (
          <button
            onClick={() => setIsSubmitted(true)}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="flex-1 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            عرض النتيجة النهائية
          </button>
        )}
        
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-10 py-5 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition disabled:opacity-0 disabled:pointer-events-none"
        >
          السابق
        </button>
      </div>
    </div>
  );
};

export default QuizView;
