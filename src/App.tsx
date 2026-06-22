import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Compass, 
  UserCheck, 
  ArrowRight,
  Shield,
  Activity,
  Zap,
  Sun,
  Moon
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import ExamEngine from './components/ExamEngine';
import ExamResults from './components/ExamResults';
import { Question, getRandomQuestions } from './data/questions';

interface AttemptHistory {
  id: string;
  date: string;
  mode: 'LENGKAP' | 'TWK' | 'TIU' | 'TKP';
  rawScores: {
    TWK: number;
    TIU: number;
    TKP: number;
  };
  passed: {
    TWK: boolean;
    TIU: boolean;
    TKP: boolean;
  };
  overallPassed: boolean;
}

export default function App() {
  const [step, setStep] = useState<'DASHBOARD' | 'EXAM' | 'RESULTS'>('DASHBOARD');
  const [examMode, setExamMode] = useState<'LENGKAP' | 'TWK' | 'TIU' | 'TKP'>('LENGKAP');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<AttemptHistory[]>([]);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('cpns_is_dark') === 'true';
  });

  // Load attempt history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cpns_attempts_history');
    if (stored) {
      try {
        setAttempts(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse attempts history:", err);
      }
    }
  }, []);

  // Synchronize HTML classes with the theme state
  useEffect(() => {
    localStorage.setItem('cpns_is_dark', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleStartExam = (mode: 'LENGKAP' | 'TWK' | 'TIU' | 'TKP') => {
    setExamMode(mode);
    setUserAnswers({});

    let generatedQuestions: Question[] = [];
    if (mode === 'LENGKAP') {
      // Pull 30 random for each category as requested by user
      const twk = getRandomQuestions('TWK', 30);
      const tiu = getRandomQuestions('TIU', 30);
      const tkp = getRandomQuestions('TKP', 30);
      
      // Combine them in partitioned order (TWK first, then TIU, then TKP)
      generatedQuestions = [...twk, ...tiu, ...tkp];
    } else {
      // Pull 30 questions for single test category
      generatedQuestions = getRandomQuestions(mode, 30); 
    }

    // Double-check single category fallback
    if (mode !== 'LENGKAP') {
      generatedQuestions = getRandomQuestions(mode, 30);
    }

    setActiveQuestions(generatedQuestions);
    setStep('EXAM');
  };

  const handleFinishExam = (finalAnswers: Record<string, string>) => {
    setUserAnswers(finalAnswers);

    // Compute scores
    let scoreTWK = 0;
    let scoreTIU = 0;
    let scoreTKP = 0;
    let tkpTotalCount = 0;

    activeQuestions.forEach(q => {
      const choice = finalAnswers[q.id];
      if (q.category === 'TWK') {
        if (choice === q.correctAnswer) scoreTWK += 5;
      } else if (q.category === 'TIU') {
        if (choice === q.correctAnswer) scoreTIU += 5;
      } else if (q.category === 'TKP') {
        tkpTotalCount++;
        if (choice && q.scores && q.scores[choice]) {
          scoreTKP += q.scores[choice];
        }
      }
    });

    const isTWKPassed = examMode !== 'LENGKAP' && examMode !== 'TWK' ? true : scoreTWK >= 65;
    const isTIUPassed = examMode !== 'LENGKAP' && examMode !== 'TIU' ? true : scoreTIU >= 80;
    
    // Config PG for TKP
    const tkpPassMark = tkpTotalCount > 0 ? 111 : 0;
    const isTKPPassed = examMode !== 'LENGKAP' && examMode !== 'TKP' ? true : scoreTKP >= tkpPassMark;

    const overallPassed = isTWKPassed && isTIUPassed && isTKPPassed;

    const newAttempt: AttemptHistory = {
      id: `attempt_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      mode: examMode,
      rawScores: {
        TWK: scoreTWK,
        TIU: scoreTIU,
        TKP: scoreTKP
      },
      passed: {
        TWK: isTWKPassed,
        TIU: isTIUPassed,
        TKP: isTKPPassed
      },
      overallPassed
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    localStorage.setItem('cpns_attempts_history', JSON.stringify(updatedAttempts));

    setStep('RESULTS');
  };

  const handleCancelExam = () => {
    if (window.confirm("Batal ujian? Seluruh pekerjaan Anda pada sesi aktif ini akan dihapus.")) {
      setStep('DASHBOARD');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat kelulusan simulator CAT Anda?")) {
      setAttempts([]);
      localStorage.removeItem('cpns_attempts_history');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col justify-between transition-colors duration-300 dark:text-slate-100 text-slate-800">
      {/* HEADER LOGO PANEL */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              CP
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">CBT Simulator</span>
              <h1 className="text-sm font-extrabold text-slate-850 dark:text-white tracking-tight leading-tight">Sistem Seleksi CASN</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Toggle Theme"
              id="theme-toggler"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-blue-600" />}
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/60 rounded-full px-3 py-1.5 border border-slate-200/50 dark:border-slate-800/80 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="hidden sm:inline">KONEKSI CAT BKN ONLINE</span>
              <span className="sm:hidden">CAT BKN</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE ROUTING SECTION */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 flex-1">
        <AnimatePresence mode="wait">
          {step === 'DASHBOARD' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                onStartExam={handleStartExam} 
                attempts={attempts} 
                onClearHistory={handleClearHistory} 
              />
            </motion.div>
          )}

          {step === 'EXAM' && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              <ExamEngine
                mode={examMode}
                questions={activeQuestions}
                onFinishExam={handleFinishExam}
                onCancelExam={handleCancelExam}
              />
            </motion.div>
          )}

          {step === 'RESULTS' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ExamResults
                mode={examMode}
                questions={activeQuestions}
                userAnswers={userAnswers}
                onRestart={() => setStep('DASHBOARD')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 space-y-1">
          <p>© 2026 Badan Kepegawaian Negara CBT Simulator. Hak Cipta Dilindungi.</p>
          <p className="text-[10px] text-slate-405 dark:text-slate-500/80">Platform ini dimigrasi dan dimodifikasi secara khusus guna persiapan seleksi Calon Pegawai Negeri Sipil dari berkas pre-tes & try out primer.</p>
        </div>
      </footer>
    </div>
  );
}
