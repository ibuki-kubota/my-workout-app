"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ローカル環境用の設定ファイルを直接読み込みます
import { 
  Check, Trophy, ChevronDown, ChevronUp, 
  Settings, Calendar as CalendarIcon, Dumbbell, Plus, Trash2,
  Activity, X, ChevronLeft, ChevronRight, Edit3, TrendingUp
} from 'lucide-react';

// --- 背景画像の定数 (青系のジム画像) ---
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2564&auto=format&fit=crop";

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
  onDelete: (id: number | string) => void;
}

// --- コンポーネント: 詳細表示モーダル ---
const LogDetailModal = ({ log, onClose, onDelete }: LogDetailModalProps) => {
  if (!log) return null;

  const displayTotalSets = log.total_sets || log.totalSets || 0;

  const handleDeleteClick = () => {
    if (log.id) {
      onDelete(log.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl shadow-blue-900/20 relative overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 border border-blue-500/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6 border-b border-neutral-800 pb-4">
          <div>
            <p className="text-xs font-bold text-blue-400 tracking-widest mb-1">WORKOUT DETAIL</p>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              {log.date}
            </h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDeleteClick}
              className="p-2 bg-neutral-800 text-red-400 rounded-full hover:bg-red-900/30 transition-colors border border-neutral-700"
              title="このログを削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-neutral-800 text-neutral-400 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-blue-950/30 rounded-2xl p-4 border border-blue-500/30">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">TOTAL SETS</p>
            <p className="text-2xl font-black text-blue-500">{displayTotalSets}</p>
          </div>
          <div className="flex-1 bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">EXERCISES</p>
            <p className="text-2xl font-black text-white">{log.items.length}</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {log.items.map((item, idx) => (
            <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-blue-300 font-mono bg-blue-950/50 px-2 py-0.5 rounded border border-blue-500/20">
                    {item.completedSets} sets
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-neutral-500 uppercase mb-0.5">FATIGUE</span>
                {item.fatigue ? (
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2
                    ${item.fatigue >= 8 ? 'bg-red-950/30 border-red-500 text-red-500' : 
                      item.fatigue >= 5 ? 'bg-yellow-950/30 border-yellow-500 text-yellow-500' : 
                      'bg-blue-950/30 border-blue-500 text-blue-500'}
                  `}>
                    {item.fatigue}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-600 font-bold">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- コンポーネント: 疲労度入力モーダル (横スクロール版) ---
const FatigueModal = ({ isOpen, onClose, onSave, exerciseName }: any) => {
  const [value, setValue] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          const el = scrollRef.current;
          el.scrollLeft = (value - 1) * 60; 
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-blue-500/30 w-full max-w-sm rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden">
        
        <h3 className="text-center text-white font-bold text-lg mb-1">{exerciseName}</h3>
        <p className="text-center text-blue-400 text-xs font-bold tracking-widest mb-8">FATIGUE LEVEL</p>

        <div className="relative mb-8 group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-[40%]"
            style={{ scrollbarWidth: 'none' }}
          >
            {levels.map((level) => (
              <div 
                key={level}
                onClick={() => setValue(level)}
                className={`
                  flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center snap-center cursor-pointer transition-all duration-300 border-2
                  ${value === level 
                    ? 'bg-blue-600 border-blue-400 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.6)] z-10' 
                    : 'bg-neutral-800 border-neutral-700 opacity-60 scale-90'}
                `}
              >
                <span className={`
                  text-2xl font-black transition-colors duration-300
                  ${value === level ? 'text-white' : 'text-neutral-400'}
                `}>
                  {level}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {levels.map(l => (
              <div key={l} className={`w-1 h-1 rounded-full transition-colors ${value === l ? 'bg-blue-500' : 'bg-neutral-800'}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-neutral-800 text-neutral-400 font-bold text-sm rounded-2xl hover:bg-neutral-700 transition-colors border border-white/5"
          >
            後で
          </button>
          <button 
            onClick={() => onSave(value)}
            className="flex-1 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
};

// --- コンポーネント: 削除ボタン ---
const DeleteButton = ({ onDelete }: any) => {
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

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setConfirming(true);
      }}
      className="p-2 rounded-lg transition-all active:scale-90 duration-200 border text-neutral-400 hover:text-white bg-neutral-800/40 hover:bg-red-900/40 border-white/10"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};

// --- コンポーネント: スライダー＋数値入力 (1kg単位) ---
const SliderInput = ({ label, value, onChange, min, max, step, unit }: any) => {
  const numericValue = parseFloat(value) || 0;

  const handleChange = (e: any) => {
    let val = e.target.value;
    onChange(`${val}${unit}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(`${val}${unit}`);
  };

  return (
    <div className="w-full group">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold transition-colors text-neutral-400 group-hover:text-blue-400">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-6 flex-1 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={numericValue}
            onChange={handleChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all border bg-neutral-800 accent-blue-500 focus:ring-blue-500/30 hover:accent-blue-400 border-white/10"
          />
        </div>
        
        <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 w-24 focus-within:border-blue-500 transition-colors">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numericValue}
            onChange={handleNumberChange}
            className="w-full bg-transparent text-right text-lg font-bold font-mono text-white focus:outline-none"
          />
          <span className="text-xs ml-1 text-neutral-500">{unit}</span>
        </div>
      </div>
    </div>
  );
};

// --- コンポーネント: 疲労度グラフ (SVG: 月次固定・Y軸全表示・グリッド付き) ---
const FatigueChart = ({ history, currentDate }: { history: LogData[], currentDate: Date }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const categories = Array.from(new Set(
    history.flatMap(log => log.items.map(item => item.name))
  )).sort();

  if (categories.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center text-neutral-600 text-xs">
        ログを記録するとここにグラフが表示されます
      </div>
    );
  }

  const currentCategory = categories[currentIndex];

  // 現在表示されている月の日数を計算（1日〜末日）
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // グラフ用データの構築（その月の全日数分）
  const chartPoints = daysArray.map(day => {
    const checkDate = new Date(year, month, day);
    const dateStr = checkDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const log = history.find(l => l.date.startsWith(dateStr));
    
    let fatigue: number | null = null;
    if (log) {
      const item = log.items.find(i => i.name === currentCategory);
      if (item && item.fatigue) {
        fatigue = item.fatigue;
      }
    }

    return {
      day: day,
      fatigue: fatigue
    };
  });

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + categories.length) % categories.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % categories.length);
  };

  // グラフ描画定数
  const height = 150; 
  const width = 300;
  const paddingX = 10;
  const paddingY = 10;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // データがあるポイントだけを抽出して線で結ぶ
  const validPoints = chartPoints
    .filter(d => d.fatigue !== null)
    .map(d => {
      const x = paddingX + ((d.day - 1) / (daysInMonth - 1)) * graphWidth;
      // Y軸: 1〜10。 (10 - val) / (10 - 1) * height
      const y = paddingY + ((10 - (d.fatigue as number)) / 9) * graphHeight;
      return { x, y, val: d.fatigue };
    });

  const polylinePoints = validPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrev} className="p-2 text-neutral-500 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">FATIGUE TREND</p>
          <h3 className="text-white font-bold text-sm mt-1">{currentCategory}</h3>
        </div>
        <button onClick={handleNext} className="p-2 text-neutral-500 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex h-40">
        {/* Y軸目盛り (1〜10常時表示) */}
        <div className="flex flex-col justify-between items-end pr-2 py-2 text-[9px] text-neutral-500 font-mono h-full border-r border-neutral-800">
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <span key={num} className="leading-none">{num}</span>
          ))}
        </div>

        {/* グラフ描画エリア */}
        <div className="flex-1 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            {/* 横グリッド線 (1〜10のレベルに合わせて描画) */}
            {[...Array(10)].map((_, i) => {
              const y = paddingY + (i / 9) * graphHeight;
              return (
                <line key={i} x1="0" y1={y} x2={width} y2={y} stroke="#222" strokeWidth="0.5" />
              );
            })}
            
            {/* 縦グリッド線 (5日おきに描画) */}
            {daysArray.filter(d => d % 5 === 0 || d === 1 || d === daysInMonth).map(day => {
               const x = paddingX + ((day - 1) / (daysInMonth - 1)) * graphWidth;
               return (
                 <line key={day} x1={x} y1="0" x2={x} y2={height} stroke="#222" strokeWidth="0.5" />
               );
            })}

            {/* 折れ線 */}
            {validPoints.length > 1 && (
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 点 */}
            {validPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1e40af" stroke="white" strokeWidth="1" />
            ))}
          </svg>
        </div>
      </div>
      
      {/* X軸ラベル */}
      <div className="flex justify-between text-[9px] text-neutral-500 px-8">
        <span>1日</span>
        <span>15日</span>
        <span>{daysInMonth}日</span>
      </div>
    </div>
  );
};

// --- コンポーネント: カレンダービュー ---
const CalendarView = ({ history }: any) => {
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

  const handleDeleteLog = async (id: number | string) => {
    if (!confirm('本当にこのログを削除しますか？\n（この操作は取り消せません）')) return;

    try {
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('削除しました');
      setSelectedLog(null);
      window.location.reload(); 
    } catch (error) {
      console.error('Error deleting log:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="pb-36 pt-24 animate-in fade-in duration-500 min-h-screen">
      <LogDetailModal 
        log={selectedLog} 
        onClose={() => setSelectedLog(null)}
        onDelete={handleDeleteLog}
      />

      <header className="fixed top-0 left-0 right-0 z-20 px-6 py-6 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <h2 className="text-xl font-black text-white tracking-tight drop-shadow-xl flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          LOG & GOAL
        </h2>
      </header>
      
      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {/* カレンダーエリア */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => changeMonth(-1)} className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-white font-bold text-lg tracking-widest">{yearMonthStr}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-neutral-800 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-neutral-500">
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
                    aspect-square rounded-xl flex items-center justify-center relative text-xs font-bold transition-all cursor-pointer border
                    ${isToday ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30' : 'text-neutral-400 hover:bg-neutral-800 border-transparent'}
                    ${isDone && !isToday ? 'bg-blue-900/20 border-blue-500/50 text-blue-400' : ''}
                  `}
                >
                  {date.getDate()}
                  {isDone && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${isToday ? 'border-white bg-white/20' : 'border-blue-400 bg-blue-900/80'}`}>
                        <Check className={`w-4 h-4 stroke-[3] ${isToday ? 'text-white' : 'text-blue-400'}`} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* グラフエリア */}
        <FatigueChart history={history} currentDate={currentDate} />

        {/* リスト表示 */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-neutral-500 tracking-widest px-2">RECENT HISTORY</p>
          {history.length === 0 && (
            <div className="text-center py-10 text-neutral-600">
              <p className="text-xs">履歴がありません</p>
            </div>
          )}
          {history.slice(0, 3).map((log: LogData) => (
             <div 
               key={log.id} 
               onClick={() => setSelectedLog(log)}
               className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex justify-between items-center shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors"
             >
               <div className="flex items-center gap-4">
                 <div className="bg-blue-900/30 p-2.5 rounded-full border border-blue-500/30">
                   <Activity className="w-4 h-4 text-blue-400" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">{log.date}</p>
                   <p className="text-[10px] text-neutral-400">{(log.total_sets || log.totalSets)} sets completed</p>
                 </div>
               </div>
               <div className="px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-xs font-mono text-blue-400 font-bold">
                 DETAIL
               </div>
             </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- コンポーネント: トレーニング実行画面 (Home: 青テーマ) ---
const WorkoutView = ({ workouts, setWorkouts, onFinish, fatigueData, setFatigueData }: any) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const toggleSet = (exerciseId: number, setIndex: number) => {
    const newWorkouts = workouts.map((workout: any) => {
      if (workout.id === exerciseId) {
        const newSets = [...workout.sets];
        newSets[setIndex].completed = !newSets[setIndex].completed;
        return { ...workout, sets: newSets };
      }
      return workout;
    });
    
    setWorkouts(newWorkouts);

    const updatedWorkout = newWorkouts.find((w: any) => w.id === exerciseId);
    if (updatedWorkout) {
      const allCompleted = updatedWorkout.sets.every((s: any) => s.completed);
      const isFatigueRecorded = !!fatigueData[exerciseId];

      if (allCompleted && !isFatigueRecorded) {
        setTimeout(() => {
          setActiveModalId(exerciseId);
        }, 500);
      }
    }
  };

  const handleSaveFatigue = (value: number) => {
    if (activeModalId) {
      setFatigueData((prev: any) => ({ ...prev, [activeModalId]: value }));
      setActiveModalId(null);
    }
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

      <header className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
        <div className="px-6 pt-5 pb-2 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] mb-1 drop-shadow-md">WORKOUT LOG</p>
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
                ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/40 hover:bg-blue-500' 
                : 'bg-neutral-800/50 border-white/5 text-neutral-500 cursor-not-allowed'}
            `}
          >
            完了
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between text-[10px] font-bold text-neutral-400 mb-2 tracking-widest">
             <span>PROGRESS</span>
             <span className={progress === 100 ? "text-blue-500" : ""}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-700 ease-out ${progress === 100 ? 'bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.8)]' : 'bg-white'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 space-y-5 mt-4">
        {progress === 100 && (
          <div className="relative overflow-hidden rounded-3xl bg-blue-900/20 border border-blue-500/30 p-8 text-center animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
            <h2 className="text-xl font-bold text-white tracking-widest mb-2">COMPLETE</h2>
            <p className="text-blue-200 text-xs">ナイスワーク！青い炎のような集中力でした。</p>
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
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                {/* 背景: 画像をやめて赤黒グラデーションに統一 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-neutral-950 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-70" />
              </div>

              <div className={`relative z-10 border rounded-3xl backdrop-blur-[0px] transition-all duration-500 ${isAllDone ? 'border-white/5 bg-black/60' : 'border-white/10'}`}>
                <div 
                  onClick={() => toggleExpand(workout.id)}
                  className="p-6 flex items-end justify-between cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[10px] font-bold tracking-widest uppercase block drop-shadow-sm ${isAllDone ? 'text-neutral-500' : 'text-blue-400'}`}>
                         {workout.part}
                       </span>
                       {fatigue && (
                         <span className="text-[9px] font-bold bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                           疲労度: {fatigue}
                         </span>
                       )}
                    </div>
                    <h3 className={`text-xl font-black tracking-wide transition-colors drop-shadow-lg ${isAllDone ? 'text-neutral-500 decoration-neutral-600 line-through' : 'text-white'}`}>
                      {workout.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAllDone && <Check className="w-6 h-6 text-blue-500 animate-in zoom-in drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" />}
                    {isExpanded 
                      ? <div className="p-2 rounded-full bg-neutral-800/50 border border-white/10"><ChevronUp className="w-4 h-4 text-neutral-300" /></div>
                      : <div className="p-2 rounded-full bg-neutral-800/50 border border-white/10"><ChevronDown className="w-4 h-4 text-neutral-300" /></div>
                    }
                  </div>
                </div>

                <div className={`
                  px-6 pb-6 space-y-2 transition-all duration-300 ease-in-out bg-black/40 backdrop-blur-md
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
                      className="flex items-center justify-between group/set cursor-pointer py-3 active:scale-95 transition-transform duration-100 border-b border-transparent hover:border-blue-500/20 hover:bg-blue-500/5 rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border
                          ${set.completed 
                            ? 'bg-blue-600 border-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)] scale-110' 
                            : 'bg-white/5 border-white/20 group-hover/set:border-blue-500/50 group-hover/set:bg-blue-500/10'}
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
                       className="w-full mt-4 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-xl hover:bg-blue-500/20 hover:text-white transition-colors"
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
      image: '', 
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
      <header className="fixed top-0 left-0 right-0 z-20 px-6 py-6 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
           <Settings className="w-5 h-5 text-blue-500" />
           EDITOR
        </h2>
        <button onClick={handleAdd} className="flex items-center gap-2 text-xs bg-blue-600 text-white px-4 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 shadow-blue-500/30">
          <Plus className="w-4 h-4" /> 追加
        </button>
      </header>

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {workouts.map((workout: any) => {
          const currentWeight = workout.sets[0]?.weight || '0kg';
          const currentReps = workout.sets[0]?.reps || '0回';
          const currentSetCount = workout.sets.length;

          return (
            <div key={workout.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start gap-4 border-b border-neutral-800 pb-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <input 
                      type="text" value={workout.name} 
                      onChange={(e) => handleChange(workout.id, 'name', e.target.value)}
                      className="bg-transparent border-b border-neutral-700 text-white font-bold text-lg w-full focus:outline-none focus:border-blue-500 transition-colors placeholder-neutral-600 pb-1"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold">種目名</p>
                  </div>
                  <div>
                    <input 
                      type="text" value={workout.part} 
                      onChange={(e) => handleChange(workout.id, 'part', e.target.value)}
                      className="bg-transparent border-b border-neutral-700 text-blue-500 text-xs font-bold tracking-widest w-full focus:outline-none focus:border-blue-500 transition-colors pb-1"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold">部位</p>
                  </div>
                </div>
                <div className="pt-2">
                  <DeleteButton onDelete={() => handleDelete(workout.id)} mode="light" />
                </div>
              </div>

              <div className="bg-neutral-800/30 rounded-2xl p-5 border border-neutral-800 space-y-6">
                {/* 重量スライダー：ステップを5に設定 */}
                <SliderInput label="SETTING WEIGHT (全セット共通)" value={currentWeight} unit="kg" min={0} max={200} step={1} onChange={(val: string) => handleBulkChange(workout.id, 'weight', val)} mode="light" />
                <SliderInput label="SETTING REPS (全セット共通)" value={currentReps} unit="回" min={1} max={30} step={1} onChange={(val: string) => handleBulkChange(workout.id, 'reps', val)} mode="light" />
                <div className="pt-2 border-t border-neutral-800">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">TOTAL SETS</span>
                      <span className="text-base font-bold font-mono text-white">{currentSetCount}<span className="text-xs ml-0.5 text-neutral-400">SETS</span></span>
                   </div>
                   <input type="range" min={1} max={10} step={1} value={currentSetCount} onChange={(e) => handleSetCountChange(workout.id, e.target.value)} className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-700 accent-neutral-500" />
                   <div className="flex justify-between text-[10px] text-neutral-500 mt-1 px-1"><span>1</span><span>10</span></div>
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
      image: '',
      sets: [
        { id: '1-1', weight: '60kg', reps: '10回', completed: false },
        { id: '1-2', weight: '60kg', reps: '10回', completed: false },
        { id: '1-3', weight: '60kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 2, name: 'リアデルト', part: '肩 / 背中',
      image: '',
      sets: [
        { id: '2-1', weight: '25kg', reps: '10回', completed: false },
        { id: '2-2', weight: '25kg', reps: '10回', completed: false },
        { id: '2-3', weight: '25kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 3, name: 'ラットプルダウン', part: '背中',
      image: '',
      sets: [
        { id: '3-1', weight: '50kg', reps: '10回', completed: false },
        { id: '3-2', weight: '50kg', reps: '10回', completed: false },
        { id: '3-3', weight: '50kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 4, name: 'ショルダープレス', part: '肩',
      image: '',
      sets: [
        { id: '4-1', weight: '40kg', reps: '10回', completed: false },
        { id: '4-2', weight: '40kg', reps: '10回', completed: false },
        { id: '4-3', weight: '40kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 5, name: 'インクラインDBカール', part: '上腕二頭筋',
      image: '',
      sets: [
        { id: '5-1', weight: '10kg', reps: '10回', completed: false },
        { id: '5-2', weight: '10kg', reps: '10回', completed: false },
        { id: '5-3', weight: '10kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 6, name: 'ライイングトライセプスExt', part: '上腕三頭筋',
      image: '',
      sets: [
        { id: '6-1', weight: '20kg', reps: '10回', completed: false },
        { id: '6-2', weight: '20kg', reps: '10回', completed: false },
        { id: '6-3', weight: '20kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 7, name: 'ロータリートーソ', part: '体幹',
      image: '',
      sets: [
        { id: '7-1', weight: '30kg', reps: '10回', completed: false },
        { id: '7-2', weight: '30kg', reps: '10回', completed: false },
        { id: '7-3', weight: '30kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 8, name: 'レッグプレス', part: '脚',
      image: '',
      sets: [
        { id: '8-1', weight: '80kg', reps: '10回', completed: false },
        { id: '8-2', weight: '80kg', reps: '10回', completed: false },
        { id: '8-3', weight: '80kg', reps: '10回', completed: false },
      ]
    },
    { 
      id: 9, name: '腹筋', part: '腹筋',
      image: '',
      sets: [
        { id: '9-1', weight: '5kg', reps: '10回', completed: false },
        { id: '9-2', weight: '5kg', reps: '10回', completed: false },
        { id: '9-3', weight: '5kg', reps: '10回', completed: false },
      ]
    },
  ];

  const [workouts, setWorkouts] = useState(initialMenu);

  // マウント時にLocalStorageからデータを復元
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkouts = localStorage.getItem('workout_app_current_workouts');
      const savedFatigue = localStorage.getItem('workout_app_current_fatigue');
      
      if (savedWorkouts) {
        try {
          setWorkouts(JSON.parse(savedWorkouts));
        } catch (e) {
          console.error("Failed to parse saved workouts", e);
        }
      }
      
      if (savedFatigue) {
        try {
          setFatigueData(JSON.parse(savedFatigue));
        } catch (e) {
          console.error("Failed to parse saved fatigue", e);
        }
      }
    }
  }, []);

  // ワークアウトや疲労度が変わるたびにLocalStorageへ保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workout_app_current_workouts', JSON.stringify(workouts));
    }
  }, [workouts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workout_app_current_fatigue', JSON.stringify(fatigueData));
    }
  }, [fatigueData]);

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
    
    // リセット時にLocalStorageもクリア
    const resetWorkouts = workouts.map((w: any) => ({
      ...w,
      sets: w.sets.map((s: any) => ({ ...s, completed: false }))
    }));
    setWorkouts(resetWorkouts);
    setFatigueData({});
    
    localStorage.removeItem('workout_app_current_workouts');
    localStorage.removeItem('workout_app_current_fatigue');
    
    // Refresh history
    fetchHistory();
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500 selection:text-white relative text-white bg-black">
      <div 
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          filter: 'contrast(1.2) brightness(0.7) grayscale(0.5)' // 青黒く見せるフィルター
        }}
      />
      {/* 青味を足すオーバーレイ */}
      <div className="fixed inset-0 z-[-1] bg-blue-950/30 pointer-events-none mix-blend-overlay"></div>
      
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

      {/* ボトムナビゲーション (青黒テーマ) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-black/90 backdrop-blur-xl border-t border-white/10 safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
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
                <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full" />
              )}
              
              <item.icon 
                className={`w-6 h-6 mb-1 transition-all duration-300 ${activeTab === item.id ? 'text-blue-500 scale-110 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]' : 'text-neutral-500 group-hover:text-neutral-300'}`} 
              />
              <span className={`text-[9px] font-black tracking-widest transition-colors ${activeTab === item.id ? 'text-white' : 'text-neutral-500'}`}>
                {item.label}
              </span>
              
              {activeTab === item.id && (
                <div className="absolute -bottom-2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(37,99,235,1)]" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}