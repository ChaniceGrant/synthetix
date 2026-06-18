"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Terminal, Code2, Copy, Hexagon, Dices } from "lucide-react";

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
    setStatus({ type: 'loading', message: 'Generating system...' });
    try {
      const newTokens = await generateThemeAction(promptToUse);
      if (JSON.stringify(newTokens) === JSON.stringify(tokens)) {
        setStatus({ type: 'error', message: 'Generation failed. Check API key.' });
      } else {
        setTokens(newTokens);
        setStatus({ type: 'success', message: 'System generated.' });
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to connect to engine.' });
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
    <main className="flex h-screen w-full overflow-hidden bg-[var(--shell-bg)] text-[var(--shell-text)]">
      
      {/* --- Left Panel: IDE Controls --- */}
      <aside className="w-80 flex-shrink-0 flex flex-col border-r border-[var(--shell-border)] bg-[var(--shell-panel)] z-10 relative">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-[var(--shell-border)] flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#EDEDED] text-[#0A0A0A]">
            <Hexagon size={18} className="fill-current" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight leading-none mb-1">Synthetix Engine</h1>
            <p className="text-[10px] font-mono text-[var(--shell-text-muted)] tracking-wider uppercase">v2.0.0</p>
          </div>
        </header>

        {/* Prompt Input */}
        <div className="p-6 border-b border-[var(--shell-border)] space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--shell-text-muted)]">
            <span className="flex items-center gap-2"><Terminal size={14} /> Prompt</span>
          </div>
          <form onSubmit={handleGenerate} className="space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 text-sm input-minimal rounded-md resize-none font-mono"
              placeholder="e.g. Minimalist fintech, high contrast, sharp edges, monochrome with blue accents."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleGenerate(e);
                }
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 py-2 px-4 rounded-md bg-[#EDEDED] hover:bg-white text-[#0A0A0A] text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Generate <span className="text-[10px] font-mono opacity-60 ml-1">⌘↵</span></>
                )}
              </button>
              <button
                type="button"
                onClick={handleRandom}
                disabled={loading}
                className="py-2 px-3 rounded-md bg-transparent border border-[var(--shell-border)] hover:bg-[#222] text-[var(--shell-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Random Vibe"
              >
                <Dices size={16} />
              </button>
            </div>
            
            {/* Status Message */}
            <div className="h-4">
              {status.type !== 'idle' && (
                <p className={`text-xs font-mono flex items-center gap-2 ${
                  status.type === 'error' ? 'text-red-400' : 
                  status.type === 'success' ? 'text-green-400' : 
                  'text-[var(--shell-text-muted)]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" /> {status.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Token JSON Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--shell-border)]">
             <span className="text-xs font-semibold uppercase tracking-wider text-[var(--shell-text-muted)] flex items-center gap-2">
               <Code2 size={14} /> Theme Tokens
             </span>
             <button className="text-[var(--shell-text-muted)] hover:text-[var(--shell-text)] transition-colors">
               <Copy size={14} />
             </button>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <pre className="text-[11px] leading-relaxed font-mono text-[var(--shell-text-muted)]">
              <code 
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(tokens, null, 2)
                    .replace(/"(.*?)":/g, '<span class="text-[#EDEDED]">"$1"</span>:')
                    .replace(/"(#[0-9a-fA-F]{3,8}|.+?)"(,?)/g, '<span class="text-[#A5D6FF]">"$1"</span>$2')
                }}
              />
            </pre>
          </div>
        </div>
      </aside>

      {/* --- Right Panel: The Canvas --- */}
      <section className="flex-1 relative bg-[#050505] overflow-hidden flex flex-col">
        {/* Canvas Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--shell-panel)] border border-[var(--shell-border)] shadow-lg pointer-events-auto">
             <span className="w-2 h-2 rounded-full bg-green-500" />
             <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--shell-text-muted)]">Canvas Live</span>
          </div>
          <div className="px-3 py-1.5 rounded-md bg-[var(--shell-panel)] border border-[var(--shell-border)] shadow-lg pointer-events-auto text-[11px] font-mono text-[var(--shell-text-muted)]">
             {tokens.visuals.vibe} • {tokens.typography.fontFamily.split(',')[0]}
          </div>
        </div>

        {/* The generated UI Container */}
        <div className="flex-1 overflow-auto custom-scrollbar p-12 md:p-20 flex items-center justify-center relative">
          
          {/* Subtle Grid Background in the container */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(var(--shell-text) 1px, transparent 1px), linear-gradient(90deg, var(--shell-text) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />

          <div className="w-full max-w-5xl space-y-12 canvas-container rounded-xl shadow-2xl overflow-hidden relative z-10 border border-[var(--shell-border)]">
            
            {/* Component Showcase Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Visualizer Area */}
              <div className="border-b lg:border-b-0 lg:border-r border-[var(--brand-border)] p-0 h-[400px] relative bg-[var(--brand-background)]">
                <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                   <Visualizer />
                </div>
              </div>

              {/* Form & Typography Area */}
              <div className="p-10 lg:p-12 space-y-10 bg-[var(--brand-background)] flex flex-col justify-center">
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--brand-heading-font-family)" }}>
                    Design System
                  </h2>
                  <p className="text-sm opacity-70 leading-relaxed" style={{ fontSize: "var(--brand-base-font-size)" }}>
                    This is a live preview of the generated design tokens. The layout uses the specific fonts, colors, borders, and shadows defined in the JSON.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
                    <input 
                      type="text" 
                      className="canvas-input w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button className="canvas-button py-3 px-4 font-semibold text-sm">
                      Primary Action
                    </button>
                    <button className="canvas-button-secondary py-3 px-4 font-semibold text-sm">
                      Secondary Action
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Palette Area */}
            <div className="border-t border-[var(--brand-border)] bg-[var(--brand-muted)] p-8 lg:p-10">
              <div className="flex flex-wrap gap-4">
                {Object.entries(tokens.colors).map(([name, color]) => (
                  <div key={name} className="flex-1 min-w-[120px] space-y-3">
                    <div 
                      className="h-16 w-full rounded-md shadow-sm border border-[var(--brand-border)]"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-xs font-bold capitalize mb-1">{name}</p>
                      <p className="text-[10px] font-mono opacity-60 uppercase">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
