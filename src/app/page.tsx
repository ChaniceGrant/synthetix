"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { 
  Sparkles, 
  Dices, 
  Palette, 
  Settings2, 
  Loader2, 
  Maximize2, 
  Layers, 
  ChevronRight, 
  Github,
  Code2
} from "lucide-react";

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
  const [showJson, setShowJson] = useState(false);
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
      
      {/* Dynamic Background Pattern */}
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
      <header className="w-full px-8 py-4 flex items-center justify-between border-b-2 border-brand-border z-10 brand-glass sticky top-0">
        <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-brand-foreground">
          <div className="w-10 h-10 bg-brand-primary text-brand-background flex items-center justify-center shadow-lg" style={{ borderRadius: "var(--brand-border-radius)" }}>
            <Settings2 size={24} />
          </div>
          Synthetix
        </div>
        
        <div className="flex items-center gap-6">
          {status.type !== 'idle' && (
            <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
              status.type === 'error' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
              status.type === 'loading' ? 'text-brand-primary border-brand-primary/20 bg-brand-primary/5' : 
              'text-green-500 border-green-500/20 bg-green-500/5'
            }`}>
              {status.type === 'loading' && <Loader2 size={12} className="animate-spin" />}
              {status.message}
            </span>
          )}
          <a href="#" className="text-brand-foreground opacity-50 hover:opacity-100 transition-opacity">
            <Github size={24} />
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row z-10 overflow-hidden">
        
        {/* Left Side: Controls & Components */}
        <aside className="w-full lg:w-[480px] flex-shrink-0 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-brand-border bg-brand-muted/10 overflow-y-auto custom-scrollbar">
          
          <div className="p-10 flex flex-col gap-8">
            <section>
              <div className="brand-badge mb-4">AI Driven</div>
              <h1 className="text-5xl font-black mb-4 tracking-tighter leading-[0.9] text-brand-foreground">
                Design <br /> Engine
              </h1>
              <p className="opacity-70 text-lg leading-snug text-brand-foreground font-medium max-w-[320px]">
                Describe an aesthetic and watch the system orchestrate every pixel.
              </p>
            </section>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Neon cyberpunk with a dark theme..."
                  className="brand-input w-full p-5 min-h-[140px] resize-none text-xl font-bold placeholder:opacity-20"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-mono uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">
                  Branding Guideline
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="brand-button flex-1 py-5 text-xl"
                >
                  <Sparkles size={24} />
                  Generate System
                </button>
                <button
                  type="button"
                  onClick={handleRandom}
                  disabled={loading}
                  className="brand-button-outline px-5"
                  title="Random Aesthetic"
                >
                  <Dices size={28} />
                </button>
              </div>
            </form>
          </div>

          <div className="px-10 pb-10 flex flex-col gap-10">
            {/* Component Preview Section */}
            <section className="flex flex-col gap-6">
              <h3 className="font-black flex items-center gap-3 text-brand-foreground text-xl uppercase tracking-wider">
                <Layers size={22} className="text-brand-primary" /> Library Preview
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="brand-card p-6 flex flex-col gap-6 bg-brand-background">
                  <div className="flex flex-wrap gap-3">
                    <button className="brand-button px-6 py-2 text-sm">Primary</button>
                    <button className="brand-button-outline px-6 py-2 text-sm">Secondary</button>
                    <div className="brand-badge bg-brand-primary/20 text-brand-primary border border-brand-primary/30">New</div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-mono uppercase opacity-50">Theme Progress</div>
                    <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-brand-primary transition-all duration-1000" 
                         style={{ width: loading ? '60%' : '100%' }}
                       />
                    </div>
                  </div>

                  <div className="brand-input p-3 text-sm opacity-50 flex items-center justify-between">
                    Input Field Preview
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </section>

            {/* Palette Section */}
            <section className="flex flex-col gap-6">
              <h3 className="font-black flex items-center gap-3 text-brand-foreground text-xl uppercase tracking-wider">
                <Palette size={22} className="text-brand-accent" /> Color Tokens
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(tokens.colors).map(([name, color]) => (
                  <div key={name} className="brand-card p-4 flex flex-col gap-3 group cursor-pointer border-transparent hover:border-brand-primary">
                    <div 
                      className="w-full h-12 shadow-inner border border-black/5"
                      style={{ backgroundColor: color, borderRadius: "calc(var(--brand-border-radius) / 2)" }}
                    />
                    <div>
                      <div className="text-[10px] font-mono uppercase opacity-40 group-hover:opacity-100 transition-opacity">{name}</div>
                      <div className="text-sm font-black text-brand-foreground truncate uppercase">{color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button 
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-30 hover:opacity-100 transition-opacity self-start"
            >
              <Code2 size={12} /> {showJson ? 'Hide' : 'Show'} Raw Tokens
            </button>

            {showJson && (
              <div className="brand-card bg-brand-foreground text-brand-background p-6 overflow-x-auto text-[10px] font-mono leading-relaxed">
                <pre>{JSON.stringify(tokens, null, 2)}</pre>
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: The Visualizer */}
        <section className="flex-1 relative flex flex-col bg-brand-background overflow-hidden">
          
          <div className="absolute inset-0 z-0">
             <Visualizer />
          </div>

          {/* Interactive Overlays */}
          <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div className="brand-glass px-6 py-3 text-brand-foreground font-black text-sm tracking-widest uppercase flex items-center gap-3 shadow-2xl pointer-events-auto cursor-help" style={{ borderRadius: "var(--brand-border-radius)" }}>
                  <Maximize2 size={18} className="text-brand-primary" /> 3D Brand Manifestation
                </div>
                
                <div className="brand-glass p-4 flex flex-col items-end gap-1 shadow-2xl pointer-events-auto" style={{ borderRadius: "var(--brand-border-radius)" }}>
                   <div className="text-[10px] font-mono uppercase opacity-50 tracking-tighter">Engine Complexity</div>
                   <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-4 transition-all duration-500 ${i < tokens.threeJs.complexity ? 'bg-brand-primary' : 'bg-brand-border opacity-30'}`}
                          style={{ borderRadius: "1px" }}
                        />
                      ))}
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end">
                <div className="brand-glass p-8 flex flex-col gap-2 shadow-2xl pointer-events-auto max-w-[280px]" style={{ borderRadius: "var(--brand-border-radius)" }}>
                   <div className="brand-badge w-fit">Vibe Analysis</div>
                   <h2 className="text-3xl font-black capitalize text-brand-foreground tracking-tighter leading-none">
                     {tokens.visuals.vibe}
                   </h2>
                   <p className="text-xs opacity-60 font-medium leading-relaxed italic">
                     System has automatically calibrated physics, lighting, and geometries to match your requested aesthetic.
                   </p>
                </div>

                <div className="brand-glass p-4 flex items-center gap-4 shadow-2xl pointer-events-auto" style={{ borderRadius: "var(--brand-border-radius)" }}>
                   <div className="flex flex-col items-end">
                      <div className="text-[10px] font-mono uppercase opacity-50">Animation</div>
                      <div className="font-black text-brand-primary uppercase tracking-tighter">Active</div>
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
                </div>
             </div>
          </div>
        </section>

      </div>
    </main>
  );
}
