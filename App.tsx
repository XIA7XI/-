
import React, { useState } from 'react';
import FishingGame from './components/FishingGame';
import { FishSpecies } from './types';
import { Anchor, Fish } from 'lucide-react';

const App: React.FC = () => {
  const [activeSpecies, setActiveSpecies] = useState<FishSpecies>(FishSpecies.CARP);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<'won' | 'lost' | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setLastResult(null);
  };

  const handleGameEnd = (won: boolean) => {
    setLastResult(won ? 'won' : 'lost');
  };

  const resetGame = () => {
    setIsPlaying(false);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-[#2c3e50] flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute bottom-10 left-10 opacity-20 text-teal-400 animate-pulse">
        <svg width="100" height="150" viewBox="0 0 100 150" fill="currentColor">
           <path d="M20,150 Q40,100 20,50 Q0,20 20,0 L30,0 Q10,20 30,50 Q50,100 30,150 Z" />
           <path d="M50,150 Q70,120 50,80 Q30,40 50,10 L60,10 Q40,40 60,80 Q80,120 60,150 Z" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-16 opacity-20 text-teal-400 animate-pulse animation-delay-500">
        <svg width="80" height="120" viewBox="0 0 80 120" fill="currentColor">
           <path d="M10,120 Q30,80 10,40 Q-10,10 10,0 L20,0 Q0,10 20,40 Q40,80 20,120 Z" />
           <path d="M40,120 Q60,90 40,50 Q20,20 40,0 L50,0 Q30,20 50,50 Q70,90 50,120 Z" />
        </svg>
      </div>
      
      {/* Bubbles */}
      <div className="absolute top-1/3 left-1/4 w-4 h-4 border-2 border-white/10 rounded-full opacity-30 animate-bounce" style={{animationDuration: '3s'}}></div>
      <div className="absolute top-2/3 right-1/4 w-6 h-6 border-2 border-white/10 rounded-full opacity-30 animate-bounce" style={{animationDuration: '5s'}}></div>

      {/* Starfish */}
      <div className="absolute bottom-4 left-1/3 text-orange-400/20 transform rotate-12">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      {/* Header / Stardew Style Box */}
      <div className="mb-8 bg-[#eab676] p-6 rounded-lg border-4 border-[#8d5524] shadow-[0_10px_0_rgba(0,0,0,0.3)] max-w-md w-full text-center relative z-10">
        {/* Corner Screw Graphics */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#c27e42] shadow-inner border border-[#5e3a18]"></div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#c27e42] shadow-inner border border-[#5e3a18]"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#c27e42] shadow-inner border border-[#5e3a18]"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#c27e42] shadow-inner border border-[#5e3a18]"></div>

        {/* Fishing Rod Decor */}
        <div className="absolute -top-6 -right-8 transform rotate-12 text-[#8d5524] drop-shadow-md hidden md:block">
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M2 22c1.5-4 6-9 12-9" />
             <path d="M19 8c1.5 0 3-1.5 3-3s-1.5-3-3-3-3 1.5-3 3 1.5 3 3 3z" />
             <path d="M14 13l3 3" />
             <path d="M17 16l2 2" />
           </svg>
        </div>

        <h1 className="text-3xl font-black text-[#8d5524] tracking-wider uppercase drop-shadow-sm flex items-center justify-center gap-2">
          <Anchor className="text-[#2c3e50]" /> Fishing Sim
        </h1>
        <p className="text-[#5e3a18] font-semibold mt-1 opacity-80">Stardew Valley Practice Tool</p>
      </div>

      {/* Main Content Area */}
      <div className="relative bg-slate-800/50 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-slate-700 z-10">
        
        {!isPlaying ? (
          <div className="flex flex-col gap-6 items-center w-full max-w-2xl animate-in fade-in zoom-in">
            <div className="w-full">
              <label className="block text-center text-slate-300 mb-4 font-bold text-lg uppercase tracking-wider">Select Your Target</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 w-full">
                {Object.values(FishSpecies).map((species) => (
                  <button
                    key={species}
                    onClick={() => setActiveSpecies(species)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-left transition-all border-l-4 group
                      ${activeSpecies === species 
                        ? 'bg-sky-600 text-white border-sky-400 shadow-lg scale-[1.02] ring-2 ring-sky-400/50' 
                        : 'bg-slate-700 text-slate-400 border-transparent hover:bg-slate-600'}
                    `}
                  >
                    <Fish size={20} className={`transition-colors ${activeSpecies === species ? 'text-sky-200' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="text-sm md:text-base truncate">{species}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-green-950 font-black rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all text-xl uppercase tracking-widest mt-2 flex justify-center items-center gap-2"
            >
              CAST LINE
            </button>
            
            {lastResult && (
              <div className={`text-sm font-bold px-4 py-2 rounded-full ${lastResult === 'won' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                Previous result: {lastResult.toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-8">
            <FishingGame 
              species={activeSpecies} 
              onGameEnd={handleGameEnd} 
              onReset={resetGame}
            />
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-slate-500 text-sm z-10 font-medium opacity-60">
        Simulating mechanics for React Training
      </footer>
    </div>
  );
};

export default App;