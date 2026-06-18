"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Send, Library, Palette, Code, Layers, MousePointer2 } from "lucide-react";

export default function Home() {
  const { tokens, setTokens } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    setStatus("Generating...");
    try {
      const newTokens = await generateThemeAction(prompt);
      if (JSON.stringify(newTokens) === JSON.stringify(tokens)) {
        setStatus("Generation returned same tokens. Check if API key is set.");
      } else {
        setTokens(newTokens);
        setStatus("Success!");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error: Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-brand-primary selection:text-brand-background transition-colors duration-700 ease-in-out">
      
      {/* --- Ambient Aurora Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-primary/20 blur-[120px] animate-blob mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-brand-accent/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-brand-secondary/10 blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply" />
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
          style={{ 
            backgroundImage: 'radial-gradient(var(--brand-foreground) 2px, transparent 2px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:px-8 lg:py-24 space-y-24">
        
        {/* --- Hero Header --- */}
        <header className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-brand-background shadow-2xl shadow-brand-primary/20 border border-brand-primary/20 animate-pulse-slow backdrop-blur-xl group cursor-pointer hover:scale-110 transition-transform duration-300">
            <Sparkles size={48} className="text-brand-primary group-hover:text-brand-accent transition-colors duration-500" />
          </div>
          <div className="space-y-4 max-w-4xl">
            <h1 
              className="text-6xl md:text-8xl font-black tracking-tighter" 
              style={{ fontFamily: "var(--brand-heading-font-family)" }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">
                AI Design Engine
              </span>
            </h1>
            <p className="text-xl md:text-3xl opacity-80 font-light leading-relaxed tracking-wide text-brand-foreground/80">
              Transform your brand vision into a living, interactive component library instantly.
            </p>
          </div>
        </header>

        {/* --- Spotlight Prompt Section --- */}
        <section className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-[calc(var(--brand-border-radius)+4px)] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            <div className="brand-card relative !p-2 flex flex-col md:flex-row items-center gap-2 bg-brand-background/90 backdrop-blur-2xl border-none shadow-2xl">
              <div className="flex-1 w-full relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-16 md:h-20 p-5 pl-6 bg-transparent border-none focus:ring-0 outline-none resize-none text-xl md:text-2xl placeholder:opacity-30 placeholder:font-light font-medium"
                  placeholder="Describe a vibe (e.g. 'Cyberpunk neon')"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(e);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="brand-button !py-4 !px-8 h-16 md:h-20 w-full md:w-auto shrink-0 text-lg group/btn shadow-none m-1"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            {/* Status Tooltip */}
            <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${status ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <div className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide border backdrop-blur-md shadow-lg ${status?.includes("Error") || status?.includes("Check") ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
                {status}
              </div>
            </div>
          </form>
        </section>

        {/* --- Main Dashboard --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 mt-12">
          
          {/* Left Column: Visualizer & Components */}
          <div className="xl:col-span-8 space-y-8 lg:space-y-12">
            
            {/* 3D Visualizer Window */}
            <div className="brand-card !p-0 overflow-hidden h-[500px] relative group hover:shadow-[0_0_40px_-10px_var(--brand-primary)]">
               <div className="absolute inset-0 bg-brand-background/40 backdrop-blur-sm z-0" />
               <div className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing">
                  <Visualizer />
               </div>
               
               {/* Floating Overlay Badges */}
               <div className="absolute top-6 left-6 z-20 bg-brand-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-border/50 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-lg">
                 <Layers size={16} className="text-brand-primary" /> Visualizer
               </div>
               <div className="absolute bottom-6 right-6 z-20 bg-brand-foreground/90 text-brand-background backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <MousePointer2 size={14} /> Drag to rotate
               </div>
            </div>

            {/* Component Showcase */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                <Library className="text-brand-primary" size={32} /> Components
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="brand-card space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Buttons</p>
                    <div className="flex flex-col gap-4">
                      <button className="brand-button w-full py-4 text-lg">Primary Action</button>
                      <button className="w-full py-4 text-lg font-semibold bg-transparent border-2 border-brand-border text-brand-foreground rounded-[var(--brand-border-radius)] hover:bg-brand-muted active:scale-[0.98] transition-all">
                        Secondary Action
                      </button>
                    </div>
                  </div>
                </div>
                <div className="brand-card space-y-6">
                  <div className="space-y-4">
                     <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Inputs</p>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Email Address</label>
                       <input 
                         className="brand-input w-full p-4 text-lg" 
                         placeholder="you@example.com" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Password</label>
                       <input 
                         type="password"
                         className="brand-input w-full p-4 text-lg" 
                         placeholder="••••••••" 
                       />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Palette & Code) */}
          <div className="xl:col-span-4 space-y-8 lg:space-y-12">
            
            {/* Palette Panel */}
            <div className="brand-card space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight relative z-10">
                 <Palette className="text-brand-accent" size={28} /> Palette
              </h2>
              <div className="flex flex-col gap-3 relative z-10">
                {Object.entries(tokens.colors).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-brand-background/80 hover:shadow-md transition-all group border border-transparent hover:border-brand-border/50 cursor-crosshair">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full shadow-inner group-hover:scale-110 transition-transform duration-300 relative border border-black/5" 
                        style={{ backgroundColor: color }} 
                      />
                      <span className="text-base font-semibold capitalize tracking-wide">{name}</span>
                    </div>
                    <span className="text-xs font-mono opacity-60 bg-brand-foreground/5 px-3 py-1.5 rounded-lg">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Panel */}
            <div className="brand-card !bg-[#0d1117] text-[#e6edf3] !border-[#30363d] space-y-4 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
                 <Code size={180} />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-4 border-b border-[#30363d] pb-4">
                 <h2 className="text-xl font-bold flex items-center gap-2">Design Tokens</h2>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                   <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                   <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                 </div>
              </div>
              <pre className="text-[13px] leading-relaxed font-mono p-2 overflow-x-auto custom-scrollbar relative z-10">
                <code 
                  className="text-[#a5d6ff]"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(tokens, null, 2).replace(/"(.*?)":/g, '<span class="text-[#7ee787]">"$1"</span>:')
                  }}
                />
              </pre>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
