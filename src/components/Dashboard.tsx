import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ListTodo, 
  CheckCircle, 
  XCircle, 
  Play, 
  Activity, 
  History, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  LineChart
} from 'lucide-react';

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

interface DashboardProps {
  onStartExam: (mode: 'LENGKAP' | 'TWK' | 'TIU' | 'TKP') => void;
  attempts: AttemptHistory[];
  onClearHistory: () => void;
}

export default function Dashboard({ onStartExam, attempts, onClearHistory }: DashboardProps) {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('cpns_user_name') || 'Calon Pegawai Negeri';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const saveName = () => {
    const finalName = tempName.trim() || 'Peserta';
    setUserName(finalName);
    localStorage.setItem('cpns_user_name', finalName);
    setIsEditingName(false);
  };

  // Stats calculation
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter(a => a.overallPassed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  const highestTWK = attempts.length > 0 ? Math.max(...attempts.map(a => a.rawScores.TWK)) : 0;
  const highestTIU = attempts.length > 0 ? Math.max(...attempts.map(a => a.rawScores.TIU)) : 0;
  const highestTKP = attempts.length > 0 ? Math.max(...attempts.map(a => a.rawScores.TKP)) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-slate-900 to-blue-950 p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-2xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-linear-to-br from-teal-500/10 to-blue-500/10 blur-2xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-300">
              <Award className="h-3.5 w-3.5" /> SIMULASI CAT CPNS AKTUAL 2026
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Selamat Datang,{' '}
              {isEditingName ? (
                <span className="inline-flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border-b-2 border-blue-400 bg-transparent px-1 font-bold text-white outline-hidden focus:border-blue-300"
                    placeholder="Masukkan nama"
                    maxLength={25}
                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Simpan
                  </button>
                </span>
              ) : (
                <span className="group relative inline-block">
                  <span className="bg-linear-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                    {userName}
                  </span>
                  <button
                    onClick={() => { setTempName(userName); setIsEditingName(true); }}
                    className="ml-2 text-xs font-normal text-slate-400 underline hover:text-white"
                  >
                    (Ubah Nama)
                  </button>
                </span>
              )}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Persiapkan dirimu menghadapi seleksi CPNS dengan platform simulasi Computer Assisted Test (CAT). 
              Aplikasi ini memutasi paket soal asli dari ujian Pra-Tes, Post-Tes, dan Try Out BKN resmi dengan bobot skoring akurat.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3.5 text-blue-600 dark:text-blue-400">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Ujian</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalAttempts}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className={`rounded-xl p-3.5 ${passRate >= 60 ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450'}`}>
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rasio Kelulusan</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{passRate}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <LineChart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Skor Tertinggi TIU</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{highestTIU} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ 150</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">Skor Tertinggi TKP</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{highestTKP} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ 150</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Section – Starts Simulation */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Pilih Paket Simulasi CAT
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Full Test Option - Main Hero */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative md:col-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-blue-600/30 dark:border-blue-500/20 bg-linear-to-b from-blue-50/55 to-white dark:from-slate-900 dark:to-slate-900/40 p-6 shadow-md transition-all hover:border-blue-600 dark:hover:border-blue-550"
            >
              <div className="absolute right-0 top-0 bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white rounded-bl-xl">
                Direkomendasikan
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-300 flex items-center gap-2">
                  Paket Simulasi Lengkap (Asli CAT)
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Uji kemampuan total CPNS Anda dengan paket lengkap yang memuat gabungan acak 30 soal TWK, 30 soal TIU, dan 30 soal TKP langsung dari bank soal terdaftar.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 font-semibold text-slate-600 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> 90 Menit
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-blue-700 dark:text-blue-300 font-semibold">
                    <ListTodo className="h-3.5 w-3.5" /> 90 Total Soal (30x3 Kategori)
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => onStartExam('LENGKAP')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all shadow-md shadow-blue-600/10 hover:bg-blue-700 group-hover:bg-blue-700 dark:hover:bg-blue-500 dark:group-hover:bg-blue-500 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white" /> Mulai Simulasi Lengkap
                </button>
              </div>
            </motion.div>

            {/* Individual category blocks */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <span className="inline-block rounded-lg bg-sky-50 dark:bg-sky-950/40 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
                  TWK
                </span>
                <h4 className="mt-3 font-bold text-slate-800 dark:text-slate-100 text-lg">Tes Wawasan Kebangsaan</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Fokus latihan 30 soal materi pilar negara, pancasila, integritas nasional, UUD 1945, otonomi daerah, otonomi nasionalisme, dan bela negara.
                </p>
              </div>
              <button
                onClick={() => onStartExam('TWK')}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-all cursor-pointer"
              >
                Mulai Latihan TWK <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <span className="inline-block rounded-lg bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                  TIU
                </span>
                <h4 className="mt-3 font-bold text-slate-800 dark:text-slate-100 text-lg">Tes Intelegensi Umum</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Uji kemampuan kognitif logis melingkupi deret angka, kemampuan silogisme, operasi penalaran gambar/bentuk, hitung pecahan, matematika, analogi kata.
                </p>
              </div>
              <button
                onClick={() => onStartExam('TIU')}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-all cursor-pointer"
              >
                Mulai Latihan TIU <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 md:col-span-2 md:w-1/2 md:mx-auto lg:col-span-1 lg:w-full"
            >
              <div>
                <span className="inline-block rounded-lg bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-widest">
                  TKP
                </span>
                <h4 className="mt-3 font-bold text-slate-800 dark:text-slate-100 text-lg">Tes Karakteristik Pribadi</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Analisis temperamen dan kepribadian profesional Anda. Setiap opsi memiliki rentang poin nilai akurat (1 s.d. 5) berdasar integritas, jejaring kerja, dan pelayanan publik.
                </p>
              </div>
              <button
                onClick={() => onStartExam('TKP')}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-all cursor-pointer"
              >
                Mulai Latihan TKP <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Sidebar Info Rules & Passing Grades */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Nilai Ambang Batas (Standard BKN)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nilai ambang batas minimal yang wajib dicapai oleh setiap peserta seleksi agar dinyatakan lolos passing grade:
            </p>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">TWK (Wawasan Kebangsaan)</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Total 30 Soal | Benar x 5</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">65 Poin</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">Min. 13 Benar</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">TIU (Intelegensi Umum)</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Total 30 Soal | Benar x 5</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">80 Poin</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">Min. 16 Benar</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/45 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">TKP (Karakteristik Pribadi)</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Total 30 Soal | Skala 1 s.d. 5</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">111 Poin</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">Skor Proporsional*</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic leading-snug">
              *Catatan: Passing Grade TKP nasional adalah 166 (dari total 45 soal). Untuk latihan 30 soal, disesuaikan secara proporsional menjadi minimal 111 poin.
            </p>
          </div>
        </div>
      </div>

      {/* History Log Section */}
      <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Riwayat Hasil Simulasi Anda
          </h2>
          {attempts.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Hapus Semua Riwayat
            </button>
          )}
        </div>

        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 space-y-2">
            <Award className="h-12 w-12 text-slate-200 dark:text-slate-750 stroke-1" />
            <p className="text-sm font-medium">Belum ada riwayat ujian.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">Selesaikan salah satu sesi simulasi di atas untuk merekap riwayat hasil kelulusan di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Tanggal Ujian</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-center">Skor TWK</th>
                  <th className="px-4 py-3 text-center">Skor TIU</th>
                  <th className="px-4 py-3 text-center">Skor TKP</th>
                  <th className="px-4 py-3 text-center">Total Nilai</th>
                  <th className="px-4 py-3 text-center">Kelulusan CAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {attempts.map((attempt) => {
                  const totalNilai = 
                    (attempt.mode === 'LENGKAP' || attempt.mode === 'TWK' ? attempt.rawScores.TWK : 0) +
                    (attempt.mode === 'LENGKAP' || attempt.mode === 'TIU' ? attempt.rawScores.TIU : 0) +
                    (attempt.mode === 'LENGKAP' || attempt.mode === 'TKP' ? attempt.rawScores.TKP : 0);

                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{attempt.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold leading-5 ${
                          attempt.mode === 'LENGKAP' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                          attempt.mode === 'TWK' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' :
                          attempt.mode === 'TIU' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        }`}>
                          {attempt.mode}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 text-center text-sm font-mono ${
                        attempt.mode === 'LENGKAP' || attempt.mode === 'TWK' 
                          ? (attempt.passed.TWK ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400') 
                          : 'text-slate-300 dark:text-slate-700'
                      }`}>
                        {attempt.mode === 'LENGKAP' || attempt.mode === 'TWK' ? attempt.rawScores.TWK : '-'}
                      </td>
                      <td className={`px-4 py-3.5 text-center text-sm font-mono ${
                        attempt.mode === 'LENGKAP' || attempt.mode === 'TIU' 
                          ? (attempt.passed.TIU ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400') 
                          : 'text-slate-300 dark:text-slate-700'
                      }`}>
                        {attempt.mode === 'LENGKAP' || attempt.mode === 'TIU' ? attempt.rawScores.TIU : '-'}
                      </td>
                      <td className={`px-4 py-3.5 text-center text-sm font-mono ${
                        attempt.mode === 'LENGKAP' || attempt.mode === 'TKP' 
                          ? (attempt.passed.TKP ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400') 
                          : 'text-slate-300 dark:text-slate-700'
                      }`}>
                        {attempt.mode === 'LENGKAP' || attempt.mode === 'TKP' ? attempt.rawScores.TKP : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                        {totalNilai}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 ${
                          attempt.overallPassed 
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-350'
                        }`}>
                          {attempt.overallPassed ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> LOLOS PG
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-450" /> TIDAK LOLOS
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
