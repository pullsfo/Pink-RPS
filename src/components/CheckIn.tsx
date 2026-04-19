import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarCheck2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

export function CheckIn() {
  const { isConnected, address } = useAccount();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    // Basic local state for demo purposes, in production this would come from a contract or server
    const lastCheckIn = localStorage.getItem(`lastCheckIn_${address}`);
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) {
        setHasCheckedIn(true);
      }
    }
  }, [address, isConfirmed]);

  const handleCheckIn = () => {
    if (!address) return;

    // Sending a 0 ETH transaction to self with empty data is a simple "Check-in"
    // that only costs gas. On Base, this is very cheap.
    sendTransaction({
      to: address,
      value: parseEther('0'),
      // In a real scenario, we might call a contract function
      // data: '0xabc123...', 
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      localStorage.setItem(`lastCheckIn_${address}`, new Date().toISOString());
      setHasCheckedIn(true);
    }
  }, [isConfirmed, address]);

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[32px] p-8 text-white shadow-xl shadow-pink-200 relative overflow-hidden group"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-start">
          <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm tracking-widest uppercase">Free Reward</span>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black border border-white/10">7d</div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Daily Check-in</h3>
          <p className="text-pink-100 text-xs leading-relaxed max-w-[200px] mx-auto opacity-80">
            Claim your daily XP boost. Just pay the Base network gas fee to verify.
          </p>
        </div>

        <button
          onClick={handleCheckIn}
          disabled={hasCheckedIn || isPending || isConfirming}
          className={cn(
            "relative w-full py-5 px-6 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 overflow-hidden shadow-inner",
            hasCheckedIn 
              ? "bg-white/20 text-white cursor-default"
              : "bg-white text-pink-600 hover:bg-pink-50"
          )}
        >
          <AnimatePresence mode="wait">
            {isPending || isConfirming ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="uppercase tracking-tighter">Claiming...</span>
              </motion.div>
            ) : hasCheckedIn ? (
              <motion.div
                key="checked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="uppercase tracking-tighter">Claimed</span>
              </motion.div>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 uppercase tracking-tighter"
              >
                Claim Reward
                <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded tracking-tighter group-active:scale-90 transition-transform">
                  + Gas Only
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-white/60 text-[10px] uppercase font-bold tracking-widest mt-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error.message.includes('User rejected') ? 'Denied' : 'Error'}</span>
          </motion.div>
        )}
      </div>
      {/* Decorative Orb */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}
