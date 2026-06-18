"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { generateThemeAction } from "@/lib/actions";
import { Visualizer } from "@/components/visualizer";
import { Sparkles, Send, Layout, Palette, Box as BoxIcon, Code } from "lucide-react";

export default function Home() {
  const { tokens, setTokens } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    try {
      const newTokens = await generateThemeAction(prompt);
      setTokens(newTokens);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-12">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-2xl brand-card bg-brand-primary/10 text-brand-primary">
          <Sparkles size={32} />
        </div>
        <h1 className="text-5xl font-bold tracking-tight">AI Design Engine</h1>
        <p className="text-xl opacity-70 max-w-2xl">
          Transform your brand vision into a living component library.
        </p>
      </header>

      <section className="brand-card max-w-3xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-brand-background border border-brand-border focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            placeholder="Describe your vibe (e.g., 'Dark cyberpunk neon experimental')"
          />
          <button
            type="submit"
            disabled={loading}
            className="brand-button w-full flex items-center justify-center gap-2 py-4 text-lg font-semibold disabled:opacity-50"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Generate"}
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Visualizer />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Layout size={24} /> Library</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="brand-card space-y-2">
                <button className="brand-button w-full">Primary</button>
                <button className="w-full py-2 border border-brand-border rounded-[var(--brand-border-radius)]">Secondary</button>
              </div>
              <div className="brand-card space-y-2">
                <input className="w-full p-2 bg-transparent border border-brand-border rounded-[var(--brand-border-radius)]" placeholder="Input" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Palette size={24} /> Palette</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(tokens.colors).map(([name, color]) => (
                <div key={name} className="brand-card p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-brand-border" style={{ backgroundColor: color }} />
                  <p className="text-sm font-mono">{color}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="brand-card bg-brand-secondary text-white p-4 overflow-x-auto">
            <pre className="text-xs font-mono">{JSON.stringify(tokens, null, 2)}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}
