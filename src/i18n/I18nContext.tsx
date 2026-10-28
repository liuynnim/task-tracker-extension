import { useEffect, useState, type ReactNode } from "react";
import { getLanguage, saveLanguage } from "../services/storage";
import { I18nContext } from "./context";
import { en } from "./locales/en";
import { vi } from "./locales/vi";
import type { Language, TranslationKey, TranslationParams } from "./types";

// Bundle translations into a single resource object
const translations = { vi, en };

// Lookup nested key value by dot-separated path
function getNestedValue(obj: unknown, path: string): string | undefined {
  const result = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);

  return typeof result === "string" ? result : undefined;
}

// Interpolate dynamic {{param}} variables
function interpolate(text: string, params?: TranslationParams): string {
  if (!params) return text;
  return Object.entries(params).reduce((acc, [key, val]) => {
    return acc.replace(new RegExp(`{{${key}}}`, "g"), String(val));
  }, text);
}

interface Props {
  children: ReactNode;
}

export function I18nProvider({ children }: Props) {
  const [language, setLanguage] = useState<Language>("en");

  // Read saved language from storage on startup
  useEffect(() => {
    getLanguage().then((savedLang) => {
      setLanguage(savedLang);
    });
  }, []);

  // Switch language and persist to storage
  const changeLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    await saveLanguage(newLang);
  };

  // Translation function
  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const currentDict = translations[language];
    const fallbackDict = translations.en;

    // 1. Check in current dictionary
    // 2. Fallback to English dictionary
    // 3. Return raw key if not found
    const rawText =
      getNestedValue(currentDict, key) ??
      getNestedValue(fallbackDict, key) ??
      key;

    return interpolate(rawText, params);
  };


  return (
    <I18nContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
