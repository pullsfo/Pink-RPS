import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect, WalletDropdownLink } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { motion } from 'motion/react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { cn } from './lib/utils';
import { Web3Provider } from './components/Web3Provider';
import { Game } from './components/Game';
import { CheckIn } from './components/CheckIn';

function MainApp() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-[#4A0E2E] selection:bg-pink-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 h-20 px-6 sm:px-10 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-pink-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-pink-600 italic uppercase">
            Base<span className="text-pink-400">Pink</span>RPS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pink-100 border border-pink-200 rounded-2xl text-[10px] font-black uppercase">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Base Mainnet
          </div>
          <Wallet>
            <ConnectWallet className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 font-bold shadow-lg shadow-pink-200 border-none transition-all">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12 grid lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-8 flex flex-col gap-8">
          {!isConnected ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-12 lg:p-20 shadow-2xl shadow-pink-100 border border-white text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-500 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Next-Gen RPS on Base
              </div>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic text-pink-900">
                Play.<br />
                <span className="text-pink-500 underline decoration-pink-100 decoration-8 underline-offset-8">
                  Earn.<br />
                </span>
                Conquer.
              </h1>
              <p className="text-pink-900/60 text-xl max-w-xl mx-auto leading-relaxed">
                Experience the first high-speed, pink-infused Rock Paper Scissors game secured by Base. Connect your wallet to start your winning streak.
              </p>
              <div className="pt-6 flex justify-center">
                <Wallet>
                  <ConnectWallet className="h-16 px-12 bg-pink-500 text-white hover:bg-pink-600 rounded-3xl font-black text-xl uppercase tracking-tighter transition-all active:scale-95 shadow-xl shadow-pink-200" />
                </Wallet>
              </div>
            </motion.div>
          ) : (
            <Game />
          )}
        </section>

        {/* Sidebar / Check-in */}
        <aside className="lg:col-span-4 sticky top-12 space-y-8">
          <CheckIn />
          
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-pink-100 border border-white flex flex-col items-center text-center">
            <h3 className="font-black text-xl mb-4 text-pink-900 flex items-center justify-center gap-2 uppercase italic tracking-tighter">
              🏆 Top Duellists
            </h3>
            <div className="w-full space-y-3">
              {[
                { name: "base_king.eth", wins: 412, initial: "BC" },
                { name: "vitalik.base", wins: 388, initial: "JP" },
                { name: "satoshi.base", wins: 342, initial: "SN" }
              ].map((item, idx) => (
                <div key={idx} className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-colors",
                  idx === 0 ? "bg-pink-50 border-pink-100" : "bg-gray-50/50 border-gray-100 opacity-60"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm",
                      idx === 0 ? "bg-pink-200 text-pink-600" : "bg-gray-200 text-gray-500"
                    )}>{item.initial}</div>
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                  <span className={cn("font-black text-sm", idx === 0 ? "text-pink-600" : "text-gray-400")}>{item.wins} Wins</span>
                </div>
              ))}
            </div>

            <div className="w-full mt-8 pt-6 border-t border-pink-50 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-pink-900 uppercase tracking-widest">Builder Status</span>
                <span className="text-[10px] text-blue-600 font-black">B-2026</span>
              </div>
              <div className="w-full h-3 bg-pink-100/50 rounded-full overflow-hidden shadow-inner font-bold">
                <div className="w-3/4 h-full bg-blue-600 shadow-lg shadow-blue-500/20" />
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 h-16 px-10 bg-white/20 backdrop-blur-md flex items-center justify-between border-t border-pink-100 mt-12">
        <div className="flex gap-6 text-[10px] font-black text-pink-400 tracking-widest uppercase italic">
          <span>Standard Web App v2.0.26</span>
          <span className="hidden sm:inline">Portal Secured by Base</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-pink-300 font-bold uppercase">Powered by</span>
          <span className="text-sm font-black text-blue-600 tracking-tighter italic">COINBASE L2</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <MainApp />
    </Web3Provider>
  );
}
