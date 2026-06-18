"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Dices, Palette, Type, MousePointer2, Settings2 } from "lucide-react";

const RANDOM_PROMPTS = [
  "80s synthwave, neon pink and cyan, dark background",
  "Minimalist scandinavian print, warm beige, typography heavy",
  "Cyberpunk dystopian, high contrast, glitchy",
  "Cottagecore, muted sage green, soft natural lighting",
  "Vaporwave aesthetics, pastel gradients",
  "Corporate brutalism, high contrast black and white, bold typography",
  "Ethereal fairycore, soft pastels, magical lighting",
  "Retro pixel art, 16-bit colors, nostalgic",
  "Modern fintech, clean lines, trustworthy blue, high contrast",
  "Dark academia, rich browns and golds, vintage styling"
];

export default function Home() {
  const { tokens, setTokens } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleGenerate = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToUse = customPrompt || prompt;
    if (!promptToUse.trim()) return;
    
    setLoading(true);
    setStatus({ type: 'loading', message: 'Cooking up some magic...' });
    try {
      const newTokens = await generateThemeAction(promptToUse);
      if (JSON.stringify(newTokens) === JSON.stringify(tokens)) {
        setStatus({ type: 'error', message: 'Oops! Check your API key.' });
      } else {
        setTokens(newTokens);
        setStatus({ type: 'success', message: 'Yay! New theme generated.' });
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 4000);
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to connect to the engine.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = () => {
    const randomPrompt = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(randomPrompt);
    handleGenerate(undefined, randomPrompt);
  };

  return (
    <main className="min-h-screen bg-[var(--shell-bg)] text-[var(--shell-text)] p-4 md:p-8 lg:p-12 selection:bg-[var(--shell-accent)] selection:text-white transition-colors duration-500">
      
      {/* Fun Top Nav */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-800">
          <div className="w-10 h-10 bg-[var(--shell-accent)] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <Settings2 size={24} />
          </div>
          Synthetix
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Playful Header & Input */}
        <header className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-purple-500/10 rotate-6 hover:rotate-12 transition-transform cursor-default">
            <Sparkles size={56} className="text-[var(--shell-accent)]" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-800 leading-tight">
            Design <span className="text-[var(--shell-accent)] relative inline-block">
              Buddy
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-purple-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Describe any vibe, mood, or aesthetic. We'll generate a complete, interactive design system in seconds.
          </p>

          <form onSubmit={handleGenerate} className="w-full mt-12 relative group">
            <div className="playful-card p-4 flex flex-col md:flex-row gap-4 relative z-10">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Candy shop with soft pinks and bold text"
                className="flex-1 playful-input px-8 py-5 text-xl font-bold text-slate-700 placeholder:text-slate-300"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRandom}
                  disabled={loading}
                  className="px-6 py-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all disabled:opacity-50 flex items-center justify-center border-b-4 border-slate-200 hover:border-slate-300 active:border-b-0 active:translate-y-1"
                  title="Surprise me!"
                >
                  <Dices size={28} />
                </button>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="playful-button px-10 py-5 text-xl flex items-center gap-3 w-full md:w-auto justify-center"
                >
                  {loading ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Magic"
                  )}
                </button>
              </div>
            </div>
            
            {/* Status Bubble */}
            <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 transition-all duration-500 z-0 ${status.type !== 'idle' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90 pointer-events-none'}`}>
              <div className={`px-8 py-4 rounded-xl text-lg font-bold shadow-xl border-4 border-white flex items-center gap-2 ${status.type === 'error' ? 'bg-red-100 text-red-600' : status.type === 'loading' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {status.type === 'loading' && <Sparkles size={20} className="animate-pulse" />}
                {status.message}
              </div>
            </div>
          </form>
        </header>

        {/* The Magic Canvas */}
        <div className="playful-card overflow-hidden mt-24 relative shadow-2xl">
          {/* Header of the canvas to look like a friendly window */}
          <div className="bg-slate-100 px-6 py-5 border-b-4 border-slate-200/50 flex items-center justify-between">
            <div className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-red-400 shadow-sm border border-red-500/20" />
              <div className="w-5 h-5 rounded-full bg-yellow-400 shadow-sm border border-yellow-500/20" />
              <div className="w-5 h-5 rounded-full bg-green-400 shadow-sm border border-green-500/20" />
            </div>
            <div className="font-extrabold text-slate-400 uppercase tracking-widest text-sm bg-white px-4 py-1.5 rounded-lg shadow-sm">
              Live Preview Sandbox
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>

          <div className="p-8 md:p-12 canvas-container bg-[var(--brand-background)] min-h-[600px] flex flex-col xl:flex-row gap-12 lg:gap-16">
            
            {/* Left side: Components */}
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-extrabold" style={{ fontFamily: "var(--brand-heading-font-family)", color: "var(--brand-foreground)" }}>
                  Hello, World! 👋
                </h2>
                <p className="text-xl opacity-80 max-w-lg leading-relaxed" style={{ fontSize: "var(--brand-base-font-size)", color: "var(--brand-foreground)" }}>
                  This is your generated design sandbox. Every color, font, and shadow is dynamically applied via CSS variables.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Inputs Card */}
                <div className="space-y-6 p-8 rounded-[calc(var(--brand-border-radius)+8px)]" style={{ backgroundColor: "var(--brand-muted)", border: "3px solid var(--brand-border)" }}>
                  <h3 className="font-bold flex items-center gap-3 text-lg opacity-80" style={{ color: "var(--brand-foreground)" }}>
                    <Type size={24} /> Inputs
                  </h3>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Username" 
                      className="canvas-input w-full p-4 font-bold text-lg"
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="canvas-input w-full p-4 font-bold text-lg"
                    />
                  </div>
                </div>

                {/* Buttons Card */}
                <div className="space-y-6 p-8 rounded-[calc(var(--brand-border-radius)+8px)]" style={{ backgroundColor: "var(--brand-muted)", border: "3px solid var(--brand-border)" }}>
                  <h3 className="font-bold flex items-center gap-3 text-lg opacity-80" style={{ color: "var(--brand-foreground)" }}>
                    <MousePointer2 size={24} /> Actions
                  </h3>
                  <div className="flex flex-col gap-4">
                    <button className="canvas-button w-full py-4 text-xl">
                      Primary Button
                    </button>
                    <button className="w-full py-4 text-xl font-bold transition-all hover:opacity-80 active:scale-95" style={{ backgroundColor: "transparent", color: "var(--brand-primary)", border: "3px solid var(--brand-primary)", borderRadius: "var(--brand-border-radius)" }}>
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>

              {/* Palette */}
              <div className="space-y-6 pt-8 border-t-4 border-dashed" style={{ borderColor: "var(--brand-border)" }}>
                <h3 className="font-bold flex items-center gap-3 opacity-80 text-xl" style={{ color: "var(--brand-foreground)" }}><Palette size={24} /> Brand Colors</h3>
                <div className="flex flex-wrap gap-6">
                  {Object.entries(tokens.colors).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center gap-3 group">
                      <div 
                        className="w-20 h-20 rounded-2xl shadow-xl border-4 border-white transition-transform group-hover:scale-110 group-hover:-translate-y-2 group-active:scale-95 cursor-pointer"
                        style={{ backgroundColor: color, boxShadow: "var(--brand-shadow)" }}
                        title={color}
                      />
                      <div className="text-center">
                        <div className="text-sm font-bold capitalize" style={{ color: "var(--brand-foreground)" }}>{name}</div>
                        <div className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-1" style={{ color: "var(--brand-foreground)" }}>{color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: 3D Visualizer */}
            <div className="w-full xl:w-[450px] h-[500px] xl:h-auto min-h-[500px] rounded-[calc(var(--brand-border-radius)+8px)] overflow-hidden relative shadow-inner" style={{ backgroundColor: "var(--brand-muted)", border: "4px solid var(--brand-border)" }}>
              <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                <Visualizer />
              </div>
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-black tracking-widest uppercase text-slate-800 shadow-md pointer-events-none border-2 border-white">
                Interactive 3D
              </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Footer spacer */}
      <div className="h-24" />
    </main>
  );
}


