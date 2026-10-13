import { createContext, useContext } from "react";
import type { Language, TranslationKey, TranslationParams } from "./types";

export interface I18nContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
