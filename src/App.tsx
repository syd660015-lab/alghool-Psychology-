
import React, { useState } from 'react';
import { LECTURES, QUIZ_QUESTIONS } from './constants';
import { ViewState, Lecture } from './types';
import QuizView from './components/QuizView';
import AIAssistant from './components/AIAssistant';
import LectureGameView from './components/LectureGame';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const renderHome = () => (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <section className="text-center space-y-6">
        <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-2">
          جامعة العريش — كلية الآداب
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight">
          أكاديمية علم النفس الدينامي
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          استكشف القوى الخفية والمحركة للسلوك البشري من خلال رحلة تعليمية تجمع بين الفلسفة العميقة والعلم الحديث.
        </p>
        <div className="pt-2 text-indigo-900/70 font-medium">
          إشراف وإعداد: د. أحمد حمدي عاشور الغول
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LECTURES.map((lecture) => (
          <div 
            key={lecture.id}
            onClick={() => {
              setSelectedLecture(lecture);
              setCurrentView('lecture');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-b-4 border-b-transparent hover:border-b-indigo-500"
          >
            <div className="text-4xl mb-6 bg-indigo-50 w-20 h-20 flex items-center justify-center rounded-3xl transition group-hover:scale-110 group-hover:bg-indigo-100 group-hover:rotate-3 shadow-inner">
              {lecture.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-indigo-900 leading-tight">
              {lecture.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
              {lecture.content}
            </p>
            <div className="flex items-center text-indigo-600 font-bold text-sm">
              <span className="ml-2">ابدأ الدراسة الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180 group-hover:translate-x-[-4px] transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-indigo-900 text-white rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="flex-1 space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black">جاهز لاختبار معلوماتك؟</h2>
          <p className="text-indigo-100 opacity-80 leading-relaxed text-lg">
            قم بتقييم استيعابك للمحاضرات الثلاث من خلال اختبار شامل مكون من 10 أسئلة تغطي كافة جوانب المقرر.
          </p>
          <button 
            onClick={() => {
              setCurrentView('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-white text-indigo-900 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-xl hover:bg-indigo-50"
          >
            بدء الاختبار الشامل 📝
          </button>
        </div>
        <div className="flex-shrink-0 bg-indigo-800 p-10 rounded-full border-8 border-indigo-700 shadow-2xl animate-pulse relative z-10">
          <span className="text-7xl">🧪</span>
        </div>
      </section>
    </div>
  );

  const renderLecture = () => {
    if (!selectedLecture) return null;
    
    const currentIndex = LECTURES.findIndex(l => l.id === selectedLecture.id);
    const prevLecture = currentIndex > 0 ? LECTURES[currentIndex - 1] : null;
    const nextLecture = currentIndex < LECTURES.length - 1 ? LECTURES[currentIndex + 1] : null;
    const progressPercent = (selectedLecture.id / LECTURES.length) * 100;

    // Dynamic progress bar color
    const getProgressColor = () => {
      if (progressPercent <= 33) return 'from-indigo-500 to-blue-500 shadow-blue-200';
      if (progressPercent <= 66) return 'from-blue-500 to-teal-500 shadow-teal-200';
      return 'from-teal-500 to-green-500 shadow-green-200';
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex justify-between items-center bg-white/60 p-4 rounded-3xl border border-white backdrop-blur-md shadow-sm">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-white px-5 py-2.5 rounded-2xl transition shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 5 5 12 12 19"></polyline>
            </svg>
            <span>الرئيسية</span>
          </button>
          
          <div className="flex items-center gap-5">
             <div className="relative">
                <div className="h-2.5 w-32 md:w-48 bg-gray-100 rounded-full overflow-hidden border border-gray-50 p-0.5 shadow-inner">
                   <div 
                     className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out shadow-lg ${getProgressColor()}`}
                     style={{ width: `${progressPercent}%` }}
                   >
                     <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                   </div>
                </div>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">التقدم</span>
               <span className="text-sm font-black text-indigo-900 tabular-nums leading-none">
                {selectedLecture.id} <span className="text-gray-300 mx-0.5">/</span> {LECTURES.length}
              </span>
             </div>
          </div>
        </div>

        <article className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
            <span className="text-8xl mb-4 relative z-10 drop-shadow-2xl hover:rotate-6 transition-transform cursor-default">
              {selectedLecture.icon}
            </span>
            <div className="bg-white/20 backdrop-blur-md px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest relative z-10 border border-white/20">
              الوحدة الدراسية {selectedLecture.id}
            </div>
          </div>
          
          <div className="p-8 md:p-14 space-y-14">
            <header className="space-y-8 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                {selectedLecture.title}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedLecture.objectives.map((obj, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-sm font-bold border border-indigo-100 shadow-sm">
                    ✨ {obj}
                  </span>
                ))}
              </div>
            </header>

            <div className="relative">
               <div className="absolute -top-4 -right-2 text-indigo-100 text-9xl font-serif select-none pointer-events-none">"</div>
               <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed text-2xl whitespace-pre-wrap font-medium px-6 border-r-8 border-indigo-600/20 relative z-10">
                {selectedLecture.content}
              </div>
            </div>

            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 shadow-inner">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">📖</div>
                <h3 className="text-2xl font-black text-indigo-900">قاموس المصطلحات</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedLecture.glossary.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition group">
                    <div className="text-indigo-600 font-black mb-3 flex items-center gap-3">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full group-hover:scale-150 transition"></div>
                      <span className="text-lg">{item.term}</span>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <LectureGameView game={selectedLecture.game} />

            <div className="pt-14 border-t-2 border-dashed border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Previous Lecture Button */}
                {prevLecture ? (
                  <button 
                    onClick={() => {
                      setSelectedLecture(prevLecture);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-6 p-6 rounded-[2rem] border-2 border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300 group text-right shadow-sm hover:shadow-md"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">العودة للسابق</div>
                      <div className="text-indigo-950 font-black text-lg line-clamp-1">{prevLecture.title}</div>
                    </div>
                  </button>
                ) : <div className="hidden sm:block"></div>}

                {/* Next Lecture Button */}
                {nextLecture ? (
                  <button 
                    onClick={() => {
                      setSelectedLecture(nextLecture);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-6 p-6 rounded-[2rem] border-2 border-indigo-600 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 group text-right shadow-xl shadow-indigo-200"
                  >
                    <div className="flex-1">
                      <div className="text-xs text-indigo-100 font-black uppercase tracking-widest mb-1">المحاضرة التالية</div>
                      <div className="text-white font-black text-lg line-clamp-1">{nextLecture.title}</div>
                    </div>
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setCurrentView('quiz');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-xl shadow-green-200 group overflow-hidden relative"
                  >
                    <div className="relative z-10 flex flex-col items-start">
                      <span className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">نهاية المسار</span>
                      <span className="text-xl font-black">الاختبار الشامل 📝</span>
                    </div>
                    <div className="relative z-10 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                       </svg>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold group-hover:rotate-12 transition-all shadow-lg shadow-indigo-200">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" opacity=".2"/>
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-indigo-950 leading-none">أكاديمية النفس</span>
              <span className="text-[11px] text-indigo-500 font-black uppercase tracking-tighter">Psychology Academy — Arish Uni</span>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <button 
              onClick={() => setCurrentView('home')}
              className={`font-black text-sm uppercase tracking-widest transition-all ${currentView === 'home' || currentView === 'lecture' ? 'text-indigo-600 border-b-4 border-indigo-600 pb-1' : 'text-gray-400 hover:text-gray-900 pb-1 border-b-4 border-transparent'}`}
            >
              المحاضرات
            </button>
            <button 
              onClick={() => setCurrentView('quiz')}
              className={`font-black text-sm uppercase tracking-widest transition-all ${currentView === 'quiz' ? 'text-indigo-600 border-b-4 border-indigo-600 pb-1' : 'text-gray-400 hover:text-gray-900 pb-1 border-b-4 border-transparent'}`}
            >
              الاختبار
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'lecture' && renderLecture()}
        {currentView === 'quiz' && <QuizView onBack={() => setCurrentView('home')} />}
      </main>

      {/* AI Tutor */}
      <AIAssistant />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-6 mb-2">
              <div className="w-12 h-px bg-indigo-100"></div>
              <div className="text-gray-900 font-black text-2xl tracking-tight">
                دكتور. أحمد حمدي عاشور الغول
              </div>
              <div className="w-12 h-px bg-indigo-100"></div>
            </div>
            
            <div className="text-indigo-600 font-black text-lg bg-indigo-50 px-6 py-2 rounded-full">
              قسم علم النفس — كلية الآداب — جامعة العريش
            </div>
            
            <div className="pt-8 w-full max-w-lg border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs font-bold">
              <p>© 2026 منصة التعليم الذكي. جميع الحقوق محفوظة.</p>
              <div className="flex gap-4">
                <span className="opacity-40">Ψ</span>
                <span className="opacity-40">🎓</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;src/App.tsx
