import { useEffect, useState, type ReactNode } from "react";
import { getLanguage, saveLanguage } from "../services/storage";
import { I18nContext } from "./context";
import { en } from "./locales/en";
import { vi } from "./locales/vi";
import type { Language, TranslationKey, TranslationParams } from "./types";

// Gom 2 từ điển lại thành một kho resources
const translations = { vi, en };

// Hàm tra cứu giá trị theo chuỗi
function getNestedValue(obj: unknown, path: string): string | undefined {
  const result = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);

  return typeof result === "string" ? result : undefined;
}

// Hàm thay thế các biến {{param}} thành giá trị truyền vào
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

  // Đọc ngôn ngữ đã lưu từ storage khi ứng dụng khởi động
  useEffect(() => {
    getLanguage().then((savedLang) => {
      setLanguage(savedLang);
    });
  }, []);

  // Hàm chuyển đổi ngôn ngữ và lưu vào storage
  const changeLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    await saveLanguage(newLang);
  };

  // Hàm dịch văn bản
  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const currentDict = translations[language];
    const fallbackDict = translations.en;

    // 1. Tìm trong từ điển hiện tại
    // 2. Nếu không có -> tìm trong từ điển tiếng Anh (fallback)
    // 3. Nếu vẫn không có -> trả về chính key đó
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
