import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  User, 
  HelpCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  CheckSquare, 
  Bookmark, 
  Flag,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { Question } from '../data/questions';

interface ExamEngineProps {
  mode: 'LENGKAP' | 'TWK' | 'TIU' | 'TKP';
  questions: Question[];
  onFinishExam: (answers: Record<string, string>) => void;
  onCancelExam: () => void;
}

export default function ExamEngine({ mode, questions, onFinishExam, onCancelExam }: ExamEngineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [doubtful, setDoubtful] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(() => {
    // 90 minutes for full test, 30 mins for category standalones
    return mode === 'LENGKAP' ? 90 * 60 : 30 * 60;
  });
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userName] = useState(() => {
    return localStorage.getItem('cpns_user_name') || 'Calon Pegawai Negeri';
  });

  const activeQuestion = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-submit on time exhaustion!
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (choice: string) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: choice
    }));
  };

  const toggleDoubtful = () => {
    setDoubtful(prev => ({
      ...prev,
      [activeQuestion.id]: !prev[activeQuestion.id]
    }));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = () => {
    onFinishExam(answers);
  };

  // Format Time format: MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="flex flex-col gap-6 lg:flex-row pb-12">
      {/* LEFT PANEL / MAIN EXAM VIEW */}
      <div className="flex-1 space-y-6">
        {/* Exam Title header & status */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-semibold leading-5 text-blue-700 dark:text-blue-300">
              SIMULASI CPNS CAT BKN 2026
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {mode === 'LENGKAP' ? 'Ujian Paket Lengkap CAT' : `Ujian Latihan Mandiri - ${mode}`}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer countdown with warning indicator */}
            <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 shadow-xs ${
              timeLeft < 300 
                ? 'animate-pulse border-rose-250 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400' 
                : 'border-blue-100 dark:border-blue-950 bg-blue-50/50 dark:bg-blue-950/10 text-slate-800 dark:text-slate-100'
            }`}>
              <Clock className={`h-5 w-5 ${timeLeft < 300 ? 'text-rose-600' : 'text-blue-600 dark:text-blue-400'}`} />
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-505">Sisa Waktu</span>
                <span className="font-mono text-lg font-extrabold leading-none">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories navigation bar for quick access of category subgroups */}
        {mode === 'LENGKAP' && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 space-x-1 rounded-xl shadow-xs overflow-hidden">
            <button 
              className={`flex-1 md:flex-none px-6 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                activeQuestion.category === 'TWK' 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/20' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              onClick={() => {
                const targetIdx = questions.findIndex(q => q.category === 'TWK');
                if (targetIdx !== -1) setCurrentIdx(targetIdx);
              }}
            >
              TWK (30)
            </button>
            <button 
              className={`flex-1 md:flex-none px-6 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                activeQuestion.category === 'TIU' 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/20' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              onClick={() => {
                const targetIdx = questions.findIndex(q => q.category === 'TIU');
                if (targetIdx !== -1) setCurrentIdx(targetIdx);
              }}
            >
              TIU (30)
            </button>
            <button 
              className={`flex-1 md:flex-none px-6 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                activeQuestion.category === 'TKP' 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/20' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              onClick={() => {
                const targetIdx = questions.findIndex(q => q.category === 'TKP');
                if (targetIdx !== -1) setCurrentIdx(targetIdx);
              }}
            >
              TKP (30)
            </button>
          </div>
        )}

        {/* ACTIVE QUESTION PANEL */}
        <div className="rounded-2xl border border-slate-155 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs/50 min-h-[460px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-slate-400">
                SOAL NOMOR <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">{currentIdx + 1}</span> DARI <span className="font-mono">{questions.length}</span>
              </span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-extrabold uppercase ${
                activeQuestion.category === 'TWK' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-850 dark:text-sky-300 border border-sky-100 dark:border-sky-800/80' :
                activeQuestion.category === 'TIU' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-850 dark:text-teal-300 border border-teal-100 dark:border-teal-800/80' :
                'bg-purple-50 dark:bg-purple-950/40 text-purple-855 dark:text-purple-300 border border-purple-100 dark:border-purple-800/80'
              }`}>
                {activeQuestion.category === 'TWK' ? 'Tes Wawasan Kebangsaan' :
                 activeQuestion.category === 'TIU' ? 'Tes Intelegensi Umum' :
                 'Tes Karakteristik Pribadi'}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-[15px] font-medium leading-relaxed text-slate-800 dark:text-slate-200 break-words whitespace-pre-line md:text-[16px]">
                {activeQuestion.text}
              </p>
            </div>

            {/* Answer Options A to E */}
            <div className="space-y-4 pt-3">
              {(Object.keys(activeQuestion.options) as Array<keyof typeof activeQuestion.options>).map((key) => {
                const optionText = activeQuestion.options[key];
                // Handled unselectable or missing option E dynamically
                if (!optionText) return null;

                const isSelected = answers[activeQuestion.id] === key;

                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(key)}
                    className={`flex w-full items-center p-4 border rounded-xl cursor-pointer group transition-all text-left font-semibold ${
                      isSelected 
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-slate-850 dark:text-slate-100 ring-2 ring-blue-105 dark:ring-blue-950' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/20 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-750'
                    }`}>
                      {key}
                    </div>
                    <span className="text-sm leading-relaxed">{optionText}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Previous, Doubtful, Next Controls Group */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> SEBELUMNYA
            </button>

            <button
              onClick={toggleDoubtful}
              disabled={!answers[activeQuestion.id]}
              className={`flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-xs font-bold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                doubtful[activeQuestion.id]
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="h-4 w-4" /> RAGU-RAGU
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 border border-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 hover:border-blue-700 cursor-pointer transition-all"
              >
                SELANJUTNYA <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 border border-emerald-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-600 hover:border-emerald-600 cursor-pointer transition-all uppercase tracking-wide"
              >
                SELESAI UJIAN <CheckSquare className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR / EXAM NAVIGATION TREE */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        {/* User profile details standard to CAT BKN UI */}
        <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 text-slate-500 ring-2 ring-slate-100 dark:ring-slate-800">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{userName}</h3>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-1.5">Kandidat Seleksi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/80">
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Terjawab</span>
              <span className="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono">{answeredCount}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/80">
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sisa Soal</span>
              <span className="text-base font-extrabold text-slate-400 dark:text-slate-500 font-mono">{unansweredCount}</span>
            </div>
          </div>
        </div>

        {/* Matrix of Question Navigation Buttons */}
        <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Monitor className="h-4 w-4 text-slate-400" /> Navigasi Soal CAT
          </h3>

          <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isSelected = currentIdx === idx;
              const hasAnswered = answers[q.id] !== undefined;
              const isDoubtful = doubtful[q.id];

              let cellStyle = 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800';
              if (hasAnswered) {
                if (isDoubtful) {
                  cellStyle = 'bg-amber-500 text-white border border-amber-500 hover:bg-amber-600';
                } else {
                  cellStyle = 'bg-blue-600 dark:bg-blue-500 text-white border border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-450 shadow-xs';
                }
              } else if (isDoubtful) {
                cellStyle = 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-500/30';
              }

              if (isSelected) {
                cellStyle = 'border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 ring-2 ring-blue-105 dark:ring-blue-950 ring-offset-1 dark:ring-offset-slate-950 font-extrabold scale-105 shadow-sm';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${cellStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" /> Sudah Dijawab
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-amber-500" /> Ragu-Ragu
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" /> Belum Dijawab
            </div>
          </div>

          {/* Selesai / Batalkan Group */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-extrabold text-white transition-all shadow-md shadow-emerald-200/50 hover:bg-emerald-600 cursor-pointer uppercase tracking-wide"
            >
              <CheckSquare className="h-3.5 w-3.5" /> Selesaikan Sesi Ujian
            </button>
            <button
              onClick={onCancelExam}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-400 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 dark:hover:border-rose-900/55 transition-all cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" /> Batalkan & Kembali
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUBMISSION MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-xl shadow-slate-900/10 space-y-6 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-955/40 p-3 text-amber-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-none">Konfirmasi Selesai Ujian</h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-1 inline-block">Apakah Anda yakin?</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div className="flex justify-between">
                  <span>Total Pertanyaan:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Telah Dijawab:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Belum Dijawab:</span>
                  <span className={`font-bold font-mono ${unansweredCount > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                    {unansweredCount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed italic">
                Peringatan: Ketika Anda menyetujui, ujian akan diakhiri seketika dan nilai Anda akan langsung dievaluasi sesuai kunci jawaban. Anda tidak dapat kembali mengubah jawaban.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Periksa Kembali
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-extrabold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  Ya, Kirim Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
