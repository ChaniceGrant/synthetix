"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Send, Library, Palette, Code, Layers } from "lucide-react";

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
    <main className="relative min-h-screen overflow-hidden selection:bg-brand-primary selection:text-brand-background">
      {/* Background Subtle Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--brand-foreground) 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-8 lg:py-20 space-y-20">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-[2rem] bg-brand-primary/10 text-brand-primary shadow-2xl shadow-brand-primary/20 backdrop-blur-md border border-brand-primary/20 animate-pulse-slow">
            <Sparkles size={40} />
          </div>
          <h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tighter drop-shadow-sm transition-all" 
            style={{ fontFamily: "var(--brand-heading-font-family)" }}
          >
            AI Design Engine
          </h1>
          <p className="text-xl md:text-2xl opacity-75 max-w-2xl font-light leading-relaxed">
            Transform your brand vision into a living, interactive component library instantly.
          </p>
        </header>

        {/* Prompt Section */}
        <section className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleGenerate} className="brand-card relative group overflow-hidden border-2 hover:border-brand-primary/50 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-36 p-5 rounded-[calc(var(--brand-border-radius)-4px)] bg-brand-background border-2 border-brand-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all resize-none text-lg placeholder:opacity-40"
                  placeholder="Describe your vibe (e.g., 'Dark cyberpunk neon experimental with glowing borders')"
                />
                <div className="absolute bottom-4 right-4 text-brand-foreground/30">
                   <Send size={20} />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="brand-button flex-1 flex items-center justify-center gap-3 py-4 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Theme
                    </>
                  )}
                </button>
                {status && (
                  <div className={`px-4 py-3 rounded-[calc(var(--brand-border-radius)-4px)] text-sm font-bold tracking-wide flex-shrink-0 border-2 ${status.includes("Error") || status.includes("Check") ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          </form>
        </section>

        {/* Output Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="brand-card p-0 overflow-hidden h-[450px] relative border-2 border-brand-border group">
               <div className="absolute inset-0 bg-brand-background/40 backdrop-blur-sm z-0" />
               <div className="relative z-10 w-full h-full">
                  <Visualizer />
               </div>
               <div className="absolute top-4 left-4 z-20 bg-brand-background/80 backdrop-blur px-3 py-1.5 rounded-full border border-brand-border text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                 <Layers size={14} className="text-brand-primary" /> Visualizer
               </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                <Library className="text-brand-primary" size={28} /> Components
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="brand-card space-y-4 flex flex-col justify-center">
                  <button className="brand-button w-full py-3 text-base">Primary Action</button>
                  <button className="w-full py-3 text-base font-semibold border-2 border-brand-border rounded-[var(--brand-border-radius)] hover:bg-brand-border/30 active:scale-[0.98] transition-all">
                    Secondary Action
                  </button>
                </div>
                <div className="brand-card space-y-4 flex flex-col justify-center">
                  <div className="space-y-2">
                     <label className="text-xs font-bold opacity-60 uppercase tracking-wider">Text Input</label>
                     <input 
                       className="w-full p-3 bg-brand-background border-2 border-brand-border focus:border-brand-primary rounded-[var(--brand-border-radius)] outline-none transition-colors" 
                       placeholder="Type something..." 
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="brand-card space-y-6 border-2 border-brand-border">
              <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                 <Palette className="text-brand-accent" size={24} /> Palette
              </h2>
              <div className="flex flex-col gap-3">
                {Object.entries(tokens.colors).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-background/60 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full border border-brand-border/50 shadow-sm group-hover:scale-110 transition-transform" 
                        style={{ backgroundColor: color }} 
                      />
                      <span className="text-sm font-semibold capitalize">{name}</span>
                    </div>
                    <span className="text-xs font-mono opacity-50 bg-brand-background px-2 py-1 rounded-md border border-brand-border/50">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-card bg-brand-secondary text-brand-muted border-none space-y-4 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none">
                 <Code size={120} />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-2">
                 <h2 className="text-xl font-bold flex items-center gap-2">Tokens</h2>
                 <span className="text-[10px] font-mono bg-black/30 px-2 py-1 rounded text-brand-muted/70 uppercase tracking-wider">JSON</span>
              </div>
              <pre className="text-xs font-mono p-4 bg-black/20 rounded-[calc(var(--brand-border-radius)-4px)] overflow-x-auto custom-scrollbar relative z-10 border border-white/5">
                {JSON.stringify(tokens, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
