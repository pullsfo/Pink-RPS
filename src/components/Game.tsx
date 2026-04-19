import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Swords, User, Cpu } from 'lucide-react';
import { MOVES, Move, WIN_SOUND, LOSE_SOUND } from '../lib/constants';
import { cn } from '../lib/utils';

export function Game() {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const determineWinner = (player: Move, computer: Move) => {
    if (player === computer) return 'draw';
    const moveData = MOVES.find(m => m.id === player);
    return moveData?.beats === computer ? 'win' : 'lose';
  };

  const playSound = (type: 'win' | 'lose') => {
    const audio = new Audio(type === 'win' ? WIN_SOUND : LOSE_SOUND);
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore autoplay blocks
  };

  const handlePlay = useCallback((move: Move) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayerMove(move);
    setComputerMove(null);
    setResult(null);

    // Simulate thinking
    setTimeout(() => {
      const randomMove = MOVES[Math.floor(Math.random() * MOVES.length)].id;
      setComputerMove(randomMove);
      
      const gameResult = determineWinner(move, randomMove);
      setResult(gameResult);
      
      if (gameResult === 'win') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        playSound('win');
      } else if (gameResult === 'lose') {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
        playSound('lose');
      }
      
      setIsPlaying(false);
    }, 1200);
  }, [isPlaying]);

  const resetGame = () => {
    setScore({ player: 0, computer: 0 });
    setPlayerMove(null);
    setComputerMove(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Score Board */}
      <div className="flex justify-between items-center bg-white rounded-3xl p-6 shadow-xl shadow-pink-100 border border-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center border border-pink-200">
            <User className="text-pink-500" />
          </div>
          <div>
            <p className="text-[10px] text-pink-900/40 uppercase tracking-widest font-black">You</p>
            <p className="text-2xl font-black text-pink-900 leading-none tracking-tighter">0{score.player}</p>
          </div>
        </div>
        
        <div className="text-center px-10 border-x border-pink-50">
          <p className="text-[10px] text-pink-300 font-black uppercase tracking-[0.2em] mb-1">Rnd</p>
          <div className="text-sm font-black text-pink-900 underline decoration-pink-200 decoration-4">LIVE</div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-[10px] text-pink-900/40 uppercase tracking-widest font-black">Base AI</p>
            <p className="text-2xl font-black text-pink-900 leading-none tracking-tighter">0{score.computer}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200">
            <Cpu className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="relative aspect-video bg-white rounded-[40px] border border-white shadow-2xl shadow-pink-100 overflow-hidden flex items-center justify-center p-8">
        {/* Animated Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-pink-100/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-rose-100/50 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 w-full flex justify-between items-center px-4 sm:px-12 gap-4">
          {/* Player Hand */}
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {playerMove ? (
                <motion.div
                  key={playerMove}
                  initial={{ x: -100, opacity: 0, scale: 0.5 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  className="w-32 h-32 sm:w-48 sm:h-48 bg-pink-50 border-4 border-pink-500 rounded-[40px] flex items-center justify-center text-6xl sm:text-8xl shadow-2xl shadow-pink-200"
                >
                  {MOVES.find(m => m.id === playerMove)?.icon}
                </motion.div>
              ) : (
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[40px] border-4 border-dashed border-pink-100 flex items-center justify-center">
                  <span className="text-pink-200 text-sm font-black uppercase tracking-tighter">Wait</span>
                </div>
              )}
            </AnimatePresence>
            <span className="text-pink-900/40 font-black uppercase text-[10px] tracking-widest">Player Move</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <p className={cn(
                    "text-4xl sm:text-6xl font-black italic uppercase tracking-tighter drop-shadow-sm",
                    result === 'win' ? 'text-pink-600' : result === 'lose' ? 'text-blue-600' : 'text-amber-500'
                  )}>
                    {result === 'draw' ? 'Tied' : result === 'win' ? 'Winner' : 'Defeat'}
                  </p>
                </motion.div>
              ) : isPlaying ? (
                <motion.div
                   animate={{ rotate: [0, 90, 180, 270, 360] }}
                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                   className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"
                />
              ) : (
                <Swords className="w-10 h-10 text-pink-200 animate-pulse" />
              )}
            </AnimatePresence>
          </div>

          {/* Computer Hand */}
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {computerMove ? (
                <motion.div
                  key={computerMove}
                  initial={{ x: 100, opacity: 0, scale: 0.5 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  className="w-32 h-32 sm:w-48 sm:h-48 bg-blue-50 border-4 border-blue-500 rounded-[40px] flex items-center justify-center text-6xl sm:text-8xl shadow-2xl shadow-blue-100"
                >
                  {MOVES.find(m => m.id === computerMove)?.icon}
                </motion.div>
              ) : isPlaying ? (
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="w-32 h-32 sm:w-48 sm:h-48 bg-blue-50/30 rounded-[40px] flex items-center justify-center text-7xl grayscale opacity-30"
                >
                  🤖
                </motion.div>
              ) : (
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[40px] border-4 border-dashed border-blue-50 flex items-center justify-center">
                   <span className="text-blue-100 text-sm font-black uppercase tracking-tighter">Base AI</span>
                </div>
              )}
            </AnimatePresence>
            <span className="text-blue-900/40 font-black uppercase text-[10px] tracking-widest">Base Move</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-3 gap-6">
        {MOVES.map((move) => (
          <button
            key={move.id}
            onClick={() => handlePlay(move.id)}
            disabled={isPlaying}
            className={cn(
              "group relative flex flex-col items-center gap-4 p-8 rounded-[38px] transition-all duration-300",
              "bg-pink-50 border-4 border-pink-100 shadow-xl shadow-pink-50/50 hover:bg-pink-100 hover:border-pink-500 hover:-translate-y-2",
              "disabled:opacity-50 disabled:grayscale disabled:pointer-events-none",
              playerMove === move.id && "bg-white border-pink-500 shadow-2xl shadow-pink-200"
            )}
          >
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {move.icon}
            </span>
            <span className="text-xs font-black text-pink-400 group-hover:text-pink-600 uppercase tracking-[0.2em] leading-none">{move.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 justify-center items-center py-4 px-8 bg-white rounded-3xl border border-white shadow-xl shadow-pink-50 max-w-fit mx-auto">
        <div className="text-center px-4">
          <div className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">Win Rate</div>
          <div className="text-xl font-black text-pink-900 leading-none">64%</div>
        </div>
        <div className="w-px h-8 bg-pink-100"></div>
        <div className="text-center px-4">
          <div className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-1">Status</div>
          <div className={cn("text-xl font-black italic uppercase leading-none", isPlaying ? "text-amber-500 animate-pulse" : "text-green-500")}>
            {isPlaying ? "Duel..." : "Ready"}
          </div>
        </div>
        <div className="w-px h-8 bg-pink-100"></div>
        <button
          onClick={resetGame}
          className="p-3 rounded-2xl bg-gray-50 hover:bg-pink-50 text-gray-300 hover:text-pink-500 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
