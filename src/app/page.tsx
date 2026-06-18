"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Dices, Palette, Settings2, Loader2, Maximize2 } from "lucide-react";

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
    setStatus({ type: 'loading', message: 'Generating environment...' });
    try {
      const newTokens = await generateThemeAction(promptToUse);
      if (JSON.stringify(newTokens) === JSON.stringify(tokens)) {
        setStatus({ type: 'error', message: 'Failed. Verify API key.' });
      } else {
        setTokens(newTokens);
        setStatus({ type: 'success', message: 'Environment updated.' });
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Engine connection lost.' });
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
    <main className="min-h-screen flex flex-col selection:bg-brand-primary selection:text-brand-background transition-colors duration-500 relative">
      
      {/* Dynamic Background Pattern based on Vibe */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] transition-opacity duration-1000 z-0"
        style={{
          backgroundImage: tokens.visuals.vibe === 'minimal' ? 'none' 
            : tokens.visuals.vibe === 'brutalism' ? `linear-gradient(45deg, var(--brand-foreground) 25%, transparent 25%, transparent 75%, var(--brand-foreground) 75%, var(--brand-foreground)), linear-gradient(45deg, var(--brand-foreground) 25%, transparent 25%, transparent 75%, var(--brand-foreground) 75%, var(--brand-foreground))` 
            : `radial-gradient(var(--brand-foreground) 1.5px, transparent 1.5px)`,
          backgroundSize: tokens.visuals.vibe === 'brutalism' ? '20px 20px' : '32px 32px',
          backgroundPosition: tokens.visuals.vibe === 'brutalism' ? '0 0, 10px 10px' : '0 0'
        }}
      />

      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b-2 border-brand-border z-10 bg-brand-background/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-brand-foreground">
          <div className="w-8 h-8 bg-brand-primary text-brand-background flex items-center justify-center shadow-md" style={{ borderRadius: "calc(var(--brand-border-radius) / 2)" }}>
            <Settings2 size={20} />
          </div>
          Synthetix
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {status.type !== 'idle' && (
            <span className={`text-sm font-semibold flex items-center gap-2 px-3 py-1 rounded-md ${
              status.type === 'error' ? 'text-red-500 bg-red-500/10' : 
              status.type === 'loading' ? 'text-brand-primary bg-brand-primary/10' : 
              'text-green-500 bg-green-500/10'
            }`}>
              {status.type === 'loading' && <Loader2 size={14} className="animate-spin" />}
              {status.message}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row z-10">
        
        {/* Left Side: Controls & Palette */}
        <aside className="w-full lg:w-[450px] flex-shrink-0 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-brand-border bg-brand-muted/30">
          
          <div className="p-8 flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none text-brand-foreground">
                Design Engine
              </h1>
              <p className="opacity-70 text-lg leading-relaxed text-brand-foreground font-medium">
                The entire UI around you is driven by the prompt below.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4 mt-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. Neon cyberpunk with a dark theme and glowing accents"
                className="brand-input w-full p-4 min-h-[120px] resize-none text-lg font-medium placeholder:opacity-40"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="brand-button flex-1 py-4 text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Generate
                </button>
                <button
                  type="button"
                  onClick={handleRandom}
                  disabled={loading}
                  className="brand-button-outline px-4 flex items-center justify-center"
                  title="Randomize"
                >
                  <Dices size={24} />
                </button>
              </div>
            </form>
          </div>

          <div className="p-8 border-t-2 border-brand-border flex-1 bg-brand-background">
            <h3 className="font-bold flex items-center gap-2 text-brand-foreground mb-6 text-xl">
              <Palette size={20} className="text-brand-accent" /> Generated Palette
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tokens.colors).map(([name, color]) => (
                <div key={name} className="brand-card p-3 flex items-center gap-3 hover:scale-[1.02] cursor-default border-transparent hover:border-brand-primary">
                  <div 
                    className="w-10 h-10 shadow-inner shrink-0 border border-black/10"
                    style={{ backgroundColor: color, borderRadius: "calc(var(--brand-border-radius) / 2)" }}
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold capitalize text-brand-foreground truncate">{name}</div>
                    <div className="text-xs font-mono opacity-60 text-brand-foreground uppercase truncate mt-0.5">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: The 3D Visualizer Dedicated Space */}
        <section className="flex-1 relative flex flex-col min-h-[500px] lg:min-h-0 bg-brand-background">
          <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
            <Visualizer />
          </div>
          
          {/* Overlay Info */}
          <div className="absolute top-6 right-6 pointer-events-none">
             <div className="bg-brand-background/80 backdrop-blur border-2 border-brand-border px-4 py-2 text-brand-foreground font-mono text-sm tracking-wider uppercase flex items-center gap-2 shadow-lg" style={{ borderRadius: "calc(var(--brand-border-radius) / 2)" }}>
               <Maximize2 size={16} className="text-brand-primary" /> Visualizer
             </div>
          </div>
          
          <div className="absolute bottom-6 left-6 pointer-events-none">
             <div className="bg-brand-foreground text-brand-background px-5 py-3 font-bold text-sm tracking-wide shadow-2xl flex flex-col gap-1" style={{ borderRadius: "calc(var(--brand-border-radius) / 2)" }}>
               <span className="uppercase text-[10px] opacity-70 tracking-widest font-mono">Current Vibe</span>
               <span className="capitalize text-lg">{tokens.visuals.vibe}</span>
             </div>
          </div>
        </section>

      </div>
    </main>
  );
}
