import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  ArrowLeft, 
  RefreshCw, 
  LineChart, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquareQuote,
  Eye
} from 'lucide-react';
import { Question } from '../data/questions';

interface ExamResultsProps {
  mode: 'LENGKAP' | 'TWK' | 'TIU' | 'TKP';
  questions: Question[];
  userAnswers: Record<string, string>;
  onRestart: () => void;
}

export default function ExamResults({ mode, questions, userAnswers, onRestart }: ExamResultsProps) {
  const [activeTab, setActiveTab] = useState<'SCORE' | 'REVIEW'>('SCORE');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'CORRECT' | 'WRONG' | 'DOUBTFUL'>('ALL');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  // Calculations
  let twkScore = 0;
  let tiuScore = 0;
  let tkpScore = 0;

  let twkCorrect = 0;
  let tiuCorrect = 0;
  
  let twkTotal = 0;
  let tiuTotal = 0;
  let tkpTotal = 0;

  questions.forEach(q => {
    const userAnswer = userAnswers[q.id];
    if (q.category === 'TWK') {
      twkTotal++;
      if (userAnswer === q.correctAnswer) {
        twkScore += 5;
        twkCorrect++;
      }
    } else if (q.category === 'TIU') {
      tiuTotal++;
      if (userAnswer === q.correctAnswer) {
        tiuScore += 5;
        tiuCorrect++;
      }
    } else if (q.category === 'TKP') {
      tkpTotal++;
      if (userAnswer && q.scores && q.scores[userAnswer]) {
        tkpScore += q.scores[userAnswer];
      }
    }
  });

  // Threshold markers
  const twkPassScore = 65; // Needed 13 correct answers out of 30 questions
  const tiuPassScore = 80; // Needed 16 correct answers
  const tkpPassScore = tkpTotal > 0 ? 111 : 0; // Scaled proportionally for 30 questions limit!

  const twkPassed = mode !== 'LENGKAP' && mode !== 'TWK' ? true : twkScore >= twkPassScore;
  const tiuPassed = mode !== 'LENGKAP' && mode !== 'TIU' ? true : tiuScore >= tiuPassScore;
  const tkpPassed = mode !== 'LENGKAP' && mode !== 'TKP' ? true : tkpScore >= tkpPassScore;

  const isOverallPassed = twkPassed && tiuPassed && tkpPassed;

  const toggleExpand = (id: string) => {
    setExpandedKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getAccuracyRate = () => {
    if (questions.length === 0) return 0;
    let correctCount = 0;
    questions.forEach(q => {
      if (q.category !== 'TKP') {
        if (userAnswers[q.id] === q.correctAnswer) correctCount++;
      } else {
        // For TKP, if score >= 4, count as high performance
        if (userAnswers[q.id] && q.scores && q.scores[userAnswers[q.id]] >= 4) correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* FINAL RESULT BANNER */}
      <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl ${
        isOverallPassed 
          ? 'bg-linear-to-br from-teal-900 via-slate-900 to-teal-950 shadow-teal-900/10' 
          : 'bg-linear-to-br from-rose-900 via-slate-900 to-rose-950 shadow-rose-900/10'
      }`}>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-slate-500/10 blur-2xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-slate-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className={`rounded-2xl p-4 ${isOverallPassed ? 'bg-teal-500/20 text-teal-300' : 'bg-rose-500/20 text-rose-300'}`}>
            <Award className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider">
              Hasil Evaluasi Simulasi CPNS
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              {isOverallPassed ? 'CONGRATULATIONS, LOLOS!' : 'BELUM LOLOS NILAI AMBANG BATAS'}
            </h1>
            <p className="max-w-xl mx-auto text-sm text-slate-300 leading-relaxed">
              {isOverallPassed 
                ? 'Luar biasa! Skor kumulatif Anda berhasil menembus Nilai Ambang Batas (Passing Grade) di seluruh kategori sub-test CAT CPNS.' 
                : 'Jangan berkecil hati. Anda masih belum melampaui skor minimal di satu atau lebih sub-test. Silakan tinjau pembahasan untuk belajar kembali.'}
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setActiveTab('SCORE')}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'SCORE' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <LineChart className="inline h-4 w-4 mr-1.5" /> Ringkasan Nilai
            </button>
            <button
              onClick={() => setActiveTab('REVIEW')}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'REVIEW' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <BookOpen className="inline h-4 w-4 mr-1.5" /> Pembahasan Soal
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'SCORE' ? (
        <div className="space-y-8">
          {/* COMPARISON RESULTS CARDS */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* TWK Box */}
            {(mode === 'LENGKAP' || mode === 'TWK') && (
              <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md uppercase tracking-wider">TWK</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${twkPassed ? 'text-teal-600' : 'text-rose-600'}`}>
                      {twkPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {twkPassed ? 'LOLOS PG' : 'TIDAK LOLOS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Skor Diperoleh</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-slate-905 dark:text-white font-mono">{twkScore}</span>
                      <span className="text-sm font-semibold text-slate-400">Ambang Batas: {twkPassScore}</span>
                    </div>
                  </div>

                  {/* Circular visual ring progress bar */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${twkPassed ? 'bg-teal-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min((twkScore / 150) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
                      <span>Benar: {twkCorrect} / {twkTotal} Soal</span>
                      <span>Maks: 150</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/55 dark:border-slate-850/60">
                  TWK menguji pemahaman wawasan pancasila, pilar nasional, UUD 1945, NKRI, dan kesadaran bela negara.
                </p>
              </div>
            )}

            {/* TIU Box */}
            {(mode === 'LENGKAP' || mode === 'TIU') && (
              <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-md uppercase tracking-wider">TIU</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${tiuPassed ? 'text-teal-600' : 'text-rose-600'}`}>
                      {tiuPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {tiuPassed ? 'LOLOS PG' : 'TIDAK LOLOS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Skor Diperoleh</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-slate-905 dark:text-white font-mono">{tiuScore}</span>
                      <span className="text-sm font-semibold text-slate-400">Ambang Batas: {tiuPassScore}</span>
                    </div>
                  </div>

                  {/* Ring bar */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${tiuPassed ? 'bg-teal-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min((tiuScore / 150) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
                      <span>Benar: {tiuCorrect} / {tiuTotal} Soal</span>
                      <span>Maks: 150</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/55 dark:border-slate-850/60">
                  TIU mengukur kemampuan analisis verbal, kuantitatif hitungan, serta pemecahan pola gambar (figural).
                </p>
              </div>
            )}

            {/* TKP Box */}
            {(mode === 'LENGKAP' || mode === 'TKP') && (
              <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-md uppercase tracking-wider">TKP</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${tkpPassed ? 'text-teal-600' : 'text-rose-600'}`}>
                      {tkpPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {tkpPassed ? 'LOLOS PG' : 'TIDAK LOLOS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Skor Diperoleh</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-extrabold text-slate-905 dark:text-white font-mono">{tkpScore}</span>
                      <span className="text-sm font-semibold text-slate-400">Ambang Batas: {tkpPassScore}</span>
                    </div>
                  </div>

                  {/* Ring bar */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${tkpPassed ? 'bg-teal-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min((tkpScore / 150) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
                      <span>Rata-Rata: {Math.round((tkpScore / tkpTotal) * 10) / 10} / 5 Poin</span>
                      <span>Maks: 150</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/55 dark:border-slate-850/60">
                  TKP menilai kedewasaan sikap, pemecahan konflik pelayanan publik, integritas, dan kerja sama tim.
                </p>
              </div>
            )}
          </div>

          {/* DYNAMIC SCORE GAUGES DETAILS */}
          <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Analisis Peforma Simulasi Anda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-850 text-center space-y-2">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Rasio Akurasi</span>
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono block">{getAccuracyRate()}%</span>
                <span className="text-xs text-slate-400 font-semibold">Tingkat Jawaban Tepat</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-850 text-center space-y-2">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Nilai Gabungan</span>
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono block">
                  {twkScore + tiuScore + tkpScore}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Batas Aman Minimal: 256</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-850 text-center space-y-2">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Status Cat Kelulusan</span>
                <span className={`text-xl font-extrabold uppercase block mt-1.5 ${isOverallPassed ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}`}>
                  {isOverallPassed ? 'MEMENUHI PG' : 'TIDAK lolos PG'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Sesuai Kriteria Passing Grade</span>
              </div>
            </div>
          </div>

          {/* BACK CONTROLS */}
          <div className="flex gap-4">
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Utama
            </button>
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Mulai Ulang Simulasi Baru
            </button>
          </div>
        </div>
      ) : (
        /* ITEM BY ITEM REVEAL CORRECTION MODE */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Pembahasan & Koreksi Mandiri</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Tinjau seluruh jawaban Anda beserta pembahasan detail di bawah ini.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReviewFilter('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${reviewFilter === 'ALL' ? 'bg-slate-900 dark:bg-slate-850 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450'}`}
              >
                Semua ({questions.length})
              </button>
              <button
                onClick={() => setReviewFilter('CORRECT')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${reviewFilter === 'CORRECT' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450'}`}
              >
                Benar
              </button>
              <button
                onClick={() => setReviewFilter('WRONG')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${reviewFilter === 'WRONG' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450'}`}
              >
                Salah / Rendah
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {questions
              .filter(q => {
                const answer = userAnswers[q.id];
                if (reviewFilter === 'ALL') return true;
                if (q.category !== 'TKP') {
                  const isCorrect = answer === q.correctAnswer;
                  return reviewFilter === 'CORRECT' ? isCorrect : !isCorrect;
                } else {
                  // TKP correctness based on highest point option (5 points)
                  const p = (q.scores && answer) ? q.scores[answer] : 0;
                  const isHigh = p >= 4;
                  return reviewFilter === 'CORRECT' ? isHigh : !isHigh;
                }
              })
              .map((q, idx) => {
                const answer = userAnswers[q.id];
                const isExpanded = expandedKeys[q.id] || false;
                
                // Details
                let scoreEarned = 0;
                let correctKey = q.correctAnswer || '';
                let isAnswerCorrect = false;

                if (q.category !== 'TKP') {
                  isAnswerCorrect = answer === q.correctAnswer;
                  if (isAnswerCorrect) scoreEarned = 5;
                } else {
                  scoreEarned = (q.scores && answer) ? q.scores[answer] : 0;
                  // Finds the choice that awards 5 points for TKP
                  correctKey = q.scores ? (Object.keys(q.scores).find(k => q.scores?.[k] === 5) || '') : '';
                  isAnswerCorrect = scoreEarned >= 4;
                }

                return (
                  <div key={q.id} className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
                    {/* Header info bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-400">
                        SOAL NOMOR <span className="font-mono text-sm font-extrabold text-slate-700 dark:text-slate-300">{idx + 1}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          q.category === 'TWK' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-305' :
                          q.category === 'TIU' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-305' :
                          'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-305'
                        }`}>
                          {q.category}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                          q.category !== 'TKP' 
                            ? (isAnswerCorrect ? 'bg-teal-100/40 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' : 'bg-rose-100/40 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300')
                            : (scoreEarned === 5 ? 'bg-teal-100/40 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300' : scoreEarned >= 3 ? 'bg-amber-100/40 dark:bg-amber-955/40 text-amber-700 dark:text-amber-300' : 'bg-rose-100/40 dark:bg-rose-955/40 text-rose-700 dark:text-rose-300')
                        }`}>
                          {scoreEarned} Poin
                        </span>
                      </div>
                    </div>

                    {/* Question body */}
                    <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      {q.text}
                    </p>

                    {/* Options status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        !answer ? 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-800 text-slate-400 dark:text-slate-500' :
                        isAnswerCorrect ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-150 dark:border-teal-800 text-slate-800 dark:text-slate-200' : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-150 dark:border-rose-800 text-slate-800 dark:text-slate-200'
                      }`}>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Jawaban Anda</span>
                        <span className="font-semibold block mt-1">
                          {answer ? `(${answer}) ${q.options[answer as keyof typeof q.options]}` : 'Tidak Menjawab'}
                        </span>
                      </div>
                      
                      <div className="p-3 bg-teal-50/20 dark:bg-teal-950/25 rounded-xl border border-teal-150/40 dark:border-teal-900/45 text-slate-800 dark:text-slate-200">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Kunci Jawaban</span>
                        <span className="font-semibold text-teal-850 dark:text-teal-300 block mt-1">
                          ({correctKey}) {q.options[correctKey as keyof typeof q.options]}
                        </span>
                      </div>
                    </div>

                    {/* Key Discussion drop-down toggle */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-750 dark:text-indigo-400 hover:text-indigo-805 dark:hover:text-indigo-305 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" /> {isExpanded ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2.5 text-xs text-slate-650 dark:text-slate-350 leading-relaxed overflow-hidden"
                        >
                          <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                            <MessageSquareQuote className="h-4 w-4 text-indigo-500" /> Penjelasan Pembahasan:
                          </div>
                          <p className="font-medium whitespace-pre-line text-slate-700 dark:text-slate-300">
                            {q.explanation}
                          </p>
                          {q.scores && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                              <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Matriks Poin Opsi (TKP)</span>
                              <div className="flex flex-wrap gap-2 text-[10px] font-extrabold font-mono">
                                {Object.entries(q.scores).map(([choice, p]) => (
                                  <span key={choice} className={`px-2 py-0.5 rounded-md ${p === 5 ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300' : p >= 3 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400'}`}>
                                    {choice}: {p} Poin
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Selesai Review & Kembali
          </button>
        </div>
      )}
    </div>
  );
}
