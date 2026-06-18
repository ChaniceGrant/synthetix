"use server";

import { generateDesignSystem } from "./engine";
import { DesignTokens } from "./tokens";

export async function generateThemeAction(prompt: string): Promise<DesignTokens> {
  return await generateDesignSystem(prompt);
}
