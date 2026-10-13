import { useI18n, type I18nContextType } from "./context";

export function useTranslation(): I18nContextType {
  return useI18n();
}

export type { I18nContextType };
