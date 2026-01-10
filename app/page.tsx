"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Supabaseクライアント読み込み
import { 
  Check, Trophy, ChevronDown, ChevronUp, 
  Settings, Calendar as CalendarIcon, Dumbbell, Plus, Trash2,
  Activity, BarChart3, X, Save, Target, ChevronLeft, ChevronRight, Clock, Layers
} from 'lucide-react';

// --- 背景画像の定数 (変更済み: Gray concrete floor by František G.) ---
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1575727137976-92c206b006a9?q=80&w=2564&auto=format&fit=crop";

// --- 型定義 ---

interface LogItem {
  name: string;
  completedSets: number | string;
  fatigue?: number;
}

interface LogData {
  id?: number | string;
  date: string;
  totalSets: number | string;
  total_sets?: number | string; 
  items: LogItem[];
  fatigue_data?: any;
}

interface LogDetailModalProps {
  log: LogData | null;
  onClose: () => void;
}

// --- コンポーネント: 詳細表示モーダル (赤テーマ) ---
const LogDetailModal = ({ log, onClose }: LogDetailModalProps) => {
  if (!log) return null;

  const displayTotalSets = log.total_sets || log.totalSets || 0;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-start mb-6 border-b border-neutral-100 pb-4">
          <div>
            <p className="text-xs font-bold text-neutral-400 tracking-widest mb-1">WORKOUT DETAIL</p>
            <h3 className="text-2xl font-black text-neutral-800 flex items-center gap-2">
              {log.date}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* サマリー */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-red-50 rounded-2xl p-4 border border-red-100">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">TOTAL SETS</p>
            <p className="text-2xl font-black text-red-600">{displayTotalSets}</p>
          </div>
          <div className="flex-1 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">EXERCISES</p>
            <p className="text-2xl font-black text-neutral-700">{log.items.length}</p>
          </div>
        </div>

        {/* 詳細リスト */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {log.items.map((item, idx) => (
            <div key={idx} className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-neutral-800 text-sm mb-1">{item.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-0.5 rounded">
                    {item.completedSets} sets
                  </span>
                </div>
              </div>
              
              {/* 疲労度表示 */}
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-neutral-400 uppercase mb-0.5">FATIGUE</span>
                {item.fatigue ? (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2
                    ${item.fatigue >= 8 ? 'bg-red-50 border-red-200 text-red-500' : 
                      item.fatigue >= 5 ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                      'bg-neutral-50 border-neutral-200 text-neutral-500'}
                  `}>
                    {item.fatigue}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-300 font-bold">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- コンポーネント: 疲労度入力モーダル (赤テーマ) ---
const FatigueModal = ({ isOpen, onClose, onSave, exerciseName }: any) => {
  const [value, setValue] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const el = scrollRef.current;
      el.scrollTop = (5 - 1) * 40; 
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900/90 border border-red-500/20 w-full max-w-xs rounded-3xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.2)] relative overflow-hidden">
        {/* 背景エフェクト */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <h3 className="text-center text-white font-bold text-lg mb-1">{exerciseName}</h3>
        <p className="text-center text-red-400 text-xs font-bold tracking-widest mb-6">FATIGUE LEVEL</p>

        <div className="relative h-48 mb-6 group">
          <div className="absolute top-1/2 left-0 right-0 h-12 -mt-6 bg-red-500/10 border-y border-red-500/30 pointer-events-none z-10"></div>
          
          <div 
            ref={scrollRef}
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide py-[calc(50%-24px)]"
          >
            {levels.map((level) => (
              <div 
                key={level}
                onClick={() => setValue(level)}
                className={`
                  h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200
                  ${value === level ? 'text-3xl font-black text-white scale-110 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'text-xl text-neutral-500 font-bold'}
                `}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-800 text-neutral-400 font-bold text-xs rounded-xl hover:bg-neutral-700 transition-colors border border-white/5"
          >
            キャンセル
          </button>
          <button 
            onClick={() => onSave(value)}
            className="flex-1 py-3 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            記録する
          </button>
        </div>
      </div>
    </div>
  );
};

// --- コンポーネント: 削除ボタン ---
const DeleteButton = ({ onDelete, mode = 'dark' }: any) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (confirming) {
      timer = setTimeout(() => setConfirming(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [confirming]);

  if (confirming) {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg animate-in fade-in slide-in-from-right-2 shadow-lg whitespace-nowrap active:scale-95 transition-transform"
      >
        削除する
      </button>
    );
  }

  const baseClass = "p-2 rounded-lg transition-all active:scale-90 duration-200 border";
  const themeClass = mode === 'light' 
    ? "text-neutral-400 hover:text-red-500 bg-neutral-100 hover:bg-red-50 border-neutral-200"
    : "text-neutral-400 hover:text-white bg-neutral-800/40 hover:bg-red-900/40 border-white/10";

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setConfirming(true);
      }}
      className={`${baseClass} ${themeClass}`}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};

// --- コンポーネント: スライダー入力 (赤テーマ) ---
const SliderInput = ({ label, value, onChange, min, max, step, unit, mode = 'dark' }: any) => {
  const numericValue = parseFloat(value) || 0;

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    onChange(`${newValue}${unit}`);
  };

  const isLight = mode === 'light';

  return (
    <div className="w-full group">
      <div className="flex justify-between items-end mb-2">
        <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${isLight ? 'text-neutral-500 group-hover:text-red-600' : 'text-neutral-400 group-hover:text-white'}`}>
          {label}
        </span>
        <span className={`text-base font-bold font-mono tracking-tight transition-colors drop-shadow-sm ${isLight ? 'text-neutral-900 group-hover:text-red-600' : 'text-white group-hover:text-red-400'}`}>
          {numericValue}<span className={`text-xs ml-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{unit}</span>
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={handleChange}
          className={`
            w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all border
            ${isLight 
              ? 'bg-neutral-200 accent-red-600 focus:ring-red-500/30 hover:accent-red-500 border-neutral-300' 
              : 'bg-neutral-800 accent-red-500 focus:ring-red-500/30 hover:accent-red-400 border-white/10'}
          `}
        />
      </div>
    </div>
  );
};

// --- コンポーネント: カレンダービュー (赤テーマ) ---
const CalendarView = ({ history, targetFrequency, setTargetFrequency }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const yearMonthStr = currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  const getLogByDate = (date: Date | null) => {
    if (!date) return null;
    const dateStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
    return history.find((log: any) => log.date === dateStr);
  };

  const weeklyCount = history.length > 0 ? history.length : 0; 
  
  let paceMessage = "まずは週1回から始めましょう。";
  if (weeklyCount >= targetFrequency) {
    paceMessage = "素晴らしい！目標ペースを達成しています。";
  } else if (weeklyCount > 0) {
    paceMessage = `あと${targetFrequency - weeklyCount}回で目標達成です。`;
  }

  return (
    <div className="pb-36 pt-24 animate-in fade-in duration-500 min-h-screen">
      <LogDetailModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />

      <header className="fixed top-0 left-0 right-0 z-20 px-6 py-6 flex justify-between items-center bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <h2 className="text-xl font-black text-white tracking-tight drop-shadow-xl flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-red-500" />
          LOG & GOAL
        </h2>
      </header>
      
      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        
        {/* 目標設定エリア */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-red-500 tracking-widest mb-1">WEEKLY GOAL</p>
              <h3 className="text-neutral-800 font-bold text-lg">今週の目標設定</h3>
            </div>
            <div className="flex items-center gap-3 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
              <button 
                onClick={() => setTargetFrequency(Math.max(1, targetFrequency - 1))}
                className="text-neutral-400 hover:text-red-500"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-xl font-black text-red-600 font-mono w-4 text-center">{targetFrequency}</span>
              <button 
                onClick={() => setTargetFrequency(Math.min(7, targetFrequency + 1))}
                className="text-neutral-400 hover:text-red-500"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-400 font-bold ml-1">DAYS</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>現在のペース</span>
              <span className="text-neutral-800 font-bold">{weeklyCount}回 / 週</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div 
                className={`h-full transition-all duration-500 ${weeklyCount >= targetFrequency ? 'bg-red-500 shadow-md' : 'bg-red-300'}`}
                style={{ width: `${Math.min(100, (weeklyCount / targetFrequency) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center bg-neutral-50 py-2 rounded-lg border border-neutral-100 font-medium">
              {paceMessage}
            </p>
          </div>
        </div>

        {/* カレンダーエリア */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => changeMonth(-1)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-neutral-800 font-bold text-lg tracking-widest">{yearMonthStr}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-neutral-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, i) => {
              if (!date) return <div key={i} className="aspect-square"></div>;
              const isToday = new Date().toDateString() === date.toDateString();
              const log = getLogByDate(date);
              const isDone = !!log;

              return (
                <div 
                  key={i} 
                  onClick={() => isDone && setSelectedLog(log)}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center relative text-xs font-bold transition-all cursor-pointer
                    ${isToday ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-400 hover:bg-neutral-50'}
                    ${isDone && !isToday ? 'bg-red-50 border border-red-100 text-red-600' : ''}
                  `}
                >
                  {date.getDate()}
                  {isDone && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${isToday ? 'border-white bg-white/20' : 'border-red-400 bg-red-100/50'}`}>
                        <Check className={`w-4 h-4 stroke-[3] ${isToday ? 'text-white' : 'text-red-500'}`} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* リスト表示 */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-neutral-300 tracking-widest px-2 drop-shadow-md">RECENT HISTORY</p>
          {history.length === 0 && (
            <div className="text-center py-10 text-white/30">
              <p className="text-xs">履歴がありません</p>
            </div>
          )}
          {history.slice(0, 3).map((log: LogData) => (
             <div 
               key={log.id} 
               onClick={() => setSelectedLog(log)}
               className="bg-white border border-neutral-200 rounded-2xl p-4 flex justify-between items-center shadow-lg cursor-pointer hover:bg-neutral-50 transition-colors"
             >
               <div className="flex items-center gap-4">
                 <div className="bg-red-50 p-2.5 rounded-full border border-red-100">
                   <Activity className="w-4 h-4 text-red-500" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-neutral-800">{log.date}</p>
                   <p className="text-[10px] text-neutral-500">{(log.total_sets || log.totalSets)} sets completed</p>
                 </div>
               </div>
               <div className="px-3 py-1 rounded-full bg-red-50 border border-red-100 text-xs font-mono text-red-600 font-bold">
                 DETAIL
               </div>
             </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- コンポーネント: トレーニング実行画面 (Home: 赤テーマ) ---
const WorkoutView = ({ workouts, setWorkouts, onFinish, fatigueData, setFatigueData, targetFrequency }: any) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const toggleSet = (exerciseId: number, setIndex: number) => {
    let justCompletedExercise = false;
    const newWorkouts = workouts.map((workout: any) => {
      if (workout.id === exerciseId) {
        const newSets = [...workout.sets];
        newSets[setIndex].completed = !newSets[setIndex].completed;
        const allCompleted = newSets.every((s: any) => s.completed);
        const wasAllCompleted = workout.sets.every((s: any) => s.completed);
        if (allCompleted && !wasAllCompleted && !fatigueData[exerciseId]) {
          justCompletedExercise = true;
        }
        return { ...workout, sets: newSets };
      }
      return workout;
    });
    setWorkouts(newWorkouts);
    if (justCompletedExercise) {
      setTimeout(() => setActiveModalId(exerciseId), 500);
    }
  };

  const handleSaveFatigue = (value: number) => {
    setFatigueData((prev: any) => ({ ...prev, [activeModalId!]: value }));
    setActiveModalId(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalSets = workouts.reduce((acc: number, curr: any) => acc + curr.sets.length, 0);
  const completedSets = workouts.reduce((acc: number, curr: any) => acc + curr.sets.filter((s: any) => s.completed).length, 0);
  const progress = totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  const activeExerciseName = activeModalId ? workouts.find((w: any) => w.id === activeModalId)?.name : '';

  return (
    <div className="pb-36 pt-32 animate-in fade-in duration-500">
      <FatigueModal 
        isOpen={!!activeModalId} 
        onClose={() => setActiveModalId(null)}
        onSave={handleSaveFatigue}
        exerciseName={activeExerciseName}
      />

      <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
        <div className="px-6 pt-5 pb-2 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-red-500 tracking-[0.2em] mb-1 drop-shadow-md">WORKOUT LOG</p>
            <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-xl flex items-center gap-2">
              TODAY
            </h1>
          </div>
          <button 
            onClick={onFinish}
            disabled={completedSets === 0}
            className={`
              px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 border shadow-lg
              active:scale-95
              ${completedSets > 0 
                ? 'bg-red-600 border-red-500 text-white shadow-red-500/40 hover:bg-red-500' 
                : 'bg-neutral-800/50 border-white/5 text-neutral-500 cursor-not-allowed'}
            `}
          >
            完了
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between text-[10px] font-bold text-neutral-300 mb-2 tracking-widest">
             <span>PROGRESS</span>
             <span className={progress === 100 ? "text-red-500" : ""}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-700 ease-out ${progress === 100 ? 'bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.8)]' : 'bg-white'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 space-y-5 mt-4">
        {progress === 100 && (
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900/60 border border-red-500/30 p-8 text-center animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            <h2 className="text-xl font-bold text-white tracking-widest mb-2">COMPLETE</h2>
            <p className="text-neutral-300 text-xs">ナイスワーク！燃えるような集中力でした。</p>
          </div>
        )}

        {workouts.map((workout: any) => {
          const isAllDone = workout.sets.every((s: any) => s.completed);
          const isExpanded = expandedId === workout.id || (!isAllDone && expandedId === null && completedSets === 0);
          const fatigue = fatigueData[workout.id];

          return (
            <div 
              key={workout.id}
              className={`
                group relative overflow-hidden rounded-3xl transition-all duration-500
                ${isAllDone 
                  ? 'opacity-80 scale-[0.99] border-transparent' 
                  : 'shadow-2xl shadow-black/50 hover:shadow-black/30'}
              `}
            >
              <div className="absolute inset-0 z-0 bg-neutral-950">
                <img 
                  src={workout.image} 
                  alt={workout.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isAllDone ? 'opacity-30 grayscale' : 'opacity-80 grayscale-[30%]'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/50 to-transparent" />
              </div>

              <div className={`relative z-10 border rounded-3xl backdrop-blur-[0px] transition-all duration-500 ${isAllDone ? 'border-white/5 bg-neutral-900/60' : 'border-white/10'}`}>
                <div 
                  onClick={() => toggleExpand(workout.id)}
                  className="p-6 flex items-end justify-between cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[10px] font-bold tracking-widest uppercase block drop-shadow-sm ${isAllDone ? 'text-neutral-500' : 'text-red-400'}`}>
                         {workout.part}
                       </span>
                       {fatigue && (
                         <span className="text-[9px] font-bold bg-red-500/20 text-red-200 px-2 py-0.5 rounded border border-red-500/30">
                           疲労度: {fatigue}
                         </span>
                       )}
                    </div>
                    <h3 className={`text-xl font-black tracking-wide transition-colors drop-shadow-lg ${isAllDone ? 'text-neutral-500 decoration-neutral-600 line-through' : 'text-white'}`}>
                      {workout.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAllDone && <Check className="w-6 h-6 text-red-500 animate-in zoom-in drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
                    {isExpanded 
                      ? <div className="p-2 rounded-full bg-neutral-800/50 border border-white/10"><ChevronUp className="w-4 h-4 text-neutral-300" /></div>
                      : <div className="p-2 rounded-full bg-neutral-800/50 border border-white/10"><ChevronDown className="w-4 h-4 text-neutral-300" /></div>
                    }
                  </div>
                </div>

                <div className={`
                  px-6 pb-6 space-y-2 transition-all duration-300 ease-in-out bg-neutral-900/80 backdrop-blur-md
                  ${expandedId === workout.id ? 'block opacity-100' : 'hidden opacity-0'}
                `}>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                  
                  {workout.sets.map((set: any, idx: number) => (
                    <div 
                      key={set.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSet(workout.id, idx);
                      }}
                      className="flex items-center justify-between group/set cursor-pointer py-3 active:scale-95 transition-transform duration-100 border-b border-transparent hover:border-red-500/20 hover:bg-red-500/5 rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border
                          ${set.completed 
                            ? 'bg-red-600 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.6)] scale-110' 
                            : 'bg-white/5 border-white/20 group-hover/set:border-red-500/50 group-hover/set:bg-red-500/10'}
                        `}>
                          {set.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                        </div>
                        <span className={`text-xs font-bold tracking-wider ${set.completed ? 'text-neutral-500' : 'text-neutral-300'}`}>
                          SET {idx + 1}
                        </span>
                      </div>

                      <div className={`flex items-baseline gap-1 font-mono ${set.completed ? 'text-neutral-500' : 'text-white'}`}>
                        <span className="text-xl font-bold tracking-tighter">{set.weight}</span>
                        <span className="text-[10px] text-neutral-400 mx-1">/</span>
                        <span className="text-lg font-medium">{set.reps}</span>
                      </div>
                    </div>
                  ))}
                  
                  {isAllDone && !fatigue && (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setActiveModalId(workout.id);
                       }}
                       className="w-full mt-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500/20 hover:text-white transition-colors"
                     >
                       疲労度を入力する
                     </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- コンポーネント: メニュー編集画面 (Edit) - 一括設定型 ---
const EditMenuView = ({ workouts, setWorkouts }: any) => {
  const handleDelete = (id: number) => setWorkouts(workouts.filter((w: any) => w.id !== id));
  
  const handleAdd = () => {
    const newId = Date.now();
    const newExercise = {
      id: newId, name: '新規種目', part: '部位',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      sets: [{ id: `${newId}-1`, weight: '20kg', reps: '10回', completed: false }]
    };
    setWorkouts([...workouts, newExercise]);
  };

  const handleChange = (id: number, field: string, value: string) => {
    setWorkouts(workouts.map((w: any) => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleBulkChange = (workoutId: number, field: string, value: string) => {
    setWorkouts(workouts.map((w: any) => {
      if (w.id === workoutId) {
        const newSets = w.sets.map((s: any) => ({ ...s, [field]: value }));
        return { ...w, sets: newSets };
      }
      return w;
    }));
  };

  const handleSetCountChange = (workoutId: number, newCount: string) => {
    const count = parseInt(newCount);
    if (isNaN(count) || count < 1) return;

    setWorkouts(workouts.map((w: any) => {
      if (w.id === workoutId) {
        const currentSets = w.sets;
        const currentCount = currentSets.length;
        if (count === currentCount) return w;
        let newSets = [...currentSets];
        if (count > currentCount) {
          const templateSet = currentSets[currentSets.length - 1];
          for (let i = 0; i < count - currentCount; i++) {
            newSets.push({ 
              ...templateSet, 
              id: `${workoutId}-${Date.now()}-${i}`, 
              completed: false 
            });
          }
        } else {
          newSets = newSets.slice(0, count);
        }
        return { ...w, sets: newSets };
      }
      return w;
    }));
  };

  return (
    <div className="pb-36 pt-24 animate-in fade-in duration-500 min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-20 px-6 py-6 flex justify-between items-center bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
           <Settings className="w-5 h-5 text-red-500" />
           EDITOR
        </h2>
        <button onClick={handleAdd} className="flex items-center gap-2 text-xs bg-red-600 text-white px-4 py-2.5 rounded-full font-bold shadow-lg hover:bg-red-500 transition-all active:scale-95 shadow-red-500/30">
          <Plus className="w-4 h-4" /> 追加
        </button>
      </header>

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {workouts.map((workout: any) => {
          const currentWeight = workout.sets[0]?.weight || '0kg';
          const currentReps = workout.sets[0]?.reps || '0回';
          const currentSetCount = workout.sets.length;

          return (
            <div key={workout.id} className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start gap-4 border-b border-neutral-100 pb-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <input 
                      type="text" value={workout.name} 
                      onChange={(e) => handleChange(workout.id, 'name', e.target.value)}
                      className="bg-transparent border-b border-neutral-300 text-neutral-800 font-bold text-lg w-full focus:outline-none focus:border-red-500 transition-colors placeholder-neutral-400 pb-1"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold">種目名</p>
                  </div>
                  <div>
                    <input 
                      type="text" value={workout.part} 
                      onChange={(e) => handleChange(workout.id, 'part', e.target.value)}
                      className="bg-transparent border-b border-neutral-300 text-red-600 text-xs font-bold tracking-widest w-full focus:outline-none focus:border-red-500 transition-colors pb-1"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold">部位</p>
                  </div>
                </div>
                <div className="pt-2">
                  <DeleteButton onDelete={() => handleDelete(workout.id)} mode="light" />
                </div>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-6">
                <SliderInput label="SETTING WEIGHT (全セット共通)" value={currentWeight} unit="kg" min={0} max={100} step={0.25} onChange={(val: string) => handleBulkChange(workout.id, 'weight', val)} mode="light" />
                <SliderInput label="SETTING REPS (全セット共通)" value={currentReps} unit="回" min={1} max={30} step={1} onChange={(val: string) => handleBulkChange(workout.id, 'reps', val)} mode="light" />
                <div className="pt-2 border-t border-neutral-200/50">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">TOTAL SETS</span>
                      <span className="text-base font-bold font-mono text-neutral-900">{currentSetCount}<span className="text-xs ml-0.5 text-neutral-400">SETS</span></span>
                   </div>
                   <input type="range" min={1} max={10} step={1} value={currentSetCount} onChange={(e) => handleSetCountChange(workout.id, e.target.value)} className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-300 accent-neutral-600" />
                   <div className="flex justify-between text-[10px] text-neutral-400 mt-1 px-1"><span>1</span><span>10</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- メインアプリ ---
export default function App() {
  const [activeTab, setActiveTab] = useState('workout'); // 'workout', 'edit', 'history'
  const [history, setHistory] = useState([]);
  const [fatigueData, setFatigueData] = useState<any>({});
  const [targetFrequency, setTargetFrequency] = useState(3);

  // 初期データ構造
  const initialMenu = [
    { 
      id: 1, name: 'チェストプレス', part: '胸',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '1-1', weight: '60kg', reps: '10回', completed: false },
        { id: '1-2', weight: '60kg', reps: '10回', completed: false },
        { id: '1-3', weight: '60kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 2, name: 'リアデルト', part: '肩 / 背中',
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '2-1', weight: '25kg', reps: '10回', completed: false },
        { id: '2-2', weight: '25kg', reps: '10回', completed: false },
        { id: '2-3', weight: '25kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 3, name: 'ラットプルダウン', part: '背中',
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '3-1', weight: '50kg', reps: '10回', completed: false },
        { id: '3-2', weight: '50kg', reps: '10回', completed: false },
        { id: '3-3', weight: '50kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 4, name: 'ショルダープレス', part: '肩',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '4-1', weight: '40kg', reps: '10回', completed: false },
        { id: '4-2', weight: '40kg', reps: '10回', completed: false },
        { id: '4-3', weight: '40kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 5, name: 'インクラインDBカール', part: '上腕二頭筋',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '5-1', weight: '8kg', reps: '10回', completed: false },
        { id: '5-2', weight: '8kg', reps: '10回', completed: false },
        { id: '5-3', weight: '8kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 6, name: 'ライイングトライセプスExt', part: '上腕三頭筋',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '6-1', weight: '1.25kg', reps: '10回', completed: false },
        { id: '6-2', weight: '1.25kg', reps: '10回', completed: false },
        { id: '6-3', weight: '1.25kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 7, name: 'ロータリートーソ', part: '体幹',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '7-1', weight: '30kg', reps: '10回', completed: false },
        { id: '7-2', weight: '30kg', reps: '10回', completed: false },
        { id: '7-3', weight: '30kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 8, name: 'レッグプレス', part: '脚',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '8-1', weight: '79kg', reps: '10回', completed: false },
        { id: '8-2', weight: '79kg', reps: '10回', completed: false },
        { id: '8-3', weight: '79kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 9, name: '腹筋', part: '腹筋',
      image: 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=800&q=80',
      sets: [
        { id: '9-1', weight: '5kg', reps: '10回', completed: false },
        { id: '9-2', weight: '5kg', reps: '10回', completed: false },
        { id: '9-3', weight: '5kg', reps: '10回', completed: false },
      ]
    },
  ];

  const [workouts, setWorkouts] = useState(initialMenu);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setHistory(data as any);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFinishWorkout = async () => {
    if (!confirm('本日のトレーニングを完了し、履歴に保存しますか？')) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
    
    const logItems = workouts.map((w: any) => ({
      name: w.name,
      totalSets: w.sets.length,
      completedSets: w.sets.filter((s: any) => s.completed).length,
      fatigue: fatigueData[w.id] || null
    })).filter((item: any) => item.completedSets > 0); 

    const { error } = await supabase
      .from('workout_logs')
      .insert([
        { 
          date: dateStr, 
          total_sets: logItems.reduce((acc: number, curr: any) => acc + curr.completedSets, 0),
          items: logItems, 
          fatigue_data: fatigueData 
        }
      ]);

    if (error) {
        console.error('Error saving workout:', error);
        alert('保存に失敗しました。');
        return;
    }

    alert('トレーニングを記録しました！');
    
    const resetWorkouts = workouts.map((w: any) => ({
      ...w,
      sets: w.sets.map((s: any) => ({ ...s, completed: false }))
    }));
    setWorkouts(resetWorkouts);
    setFatigueData({});
    
    // Refresh history
    fetchHistory();
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-red-500 selection:text-white relative text-white bg-neutral-950">
      <div 
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          filter: 'contrast(1.1) brightness(0.8) hue-rotate(-10deg)' 
        }}
      />
      
      {activeTab === 'workout' && (
        <WorkoutView 
          workouts={workouts} 
          setWorkouts={setWorkouts} 
          onFinish={handleFinishWorkout}
          fatigueData={fatigueData}
          setFatigueData={setFatigueData}
          targetFrequency={targetFrequency}
        />
      )}
      
      {activeTab === 'edit' && (
        <EditMenuView 
          workouts={workouts} 
          setWorkouts={setWorkouts} 
        />
      )}
      
      {activeTab === 'history' && (
        <CalendarView 
          history={history} 
          targetFrequency={targetFrequency}
          setTargetFrequency={setTargetFrequency}
        />
      )}

      {/* ボトムナビゲーション (赤テーマ) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-neutral-900/80 backdrop-blur-xl border-t border-white/10 safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: 'workout', icon: Dumbbell, label: 'WORKOUT' },
            { id: 'edit', icon: Settings, label: 'EDITOR' },
            { id: 'history', icon: CalendarIcon, label: 'LOG' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 group
                ${activeTab === item.id ? 'translate-y-[-4px]' : 'hover:bg-white/5'}
              `}
            >
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full" />
              )}
              
              <item.icon 
                className={`w-6 h-6 mb-1 transition-all duration-300 ${activeTab === item.id ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'text-neutral-500 group-hover:text-neutral-300'}`} 
              />
              <span className={`text-[9px] font-black tracking-widest transition-colors ${activeTab === item.id ? 'text-white' : 'text-neutral-500'}`}>
                {item.label}
              </span>
              
              {activeTab === item.id && (
                <div className="absolute -bottom-2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_rgba(220,38,38,1)]" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}