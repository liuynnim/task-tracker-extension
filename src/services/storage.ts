import type { Language } from "../i18n/types";
import type { Theme } from "../theme/types";
import type { Task } from "../types/task";


const KEY = "task_tracker_items";
const LANG_KEY = "task_tracker_language";

export async function getTasks(): Promise<Task[]> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      throw new Error("Unable to read data from localStorage", { cause: err });
    }
  }

  try {
    const data = await chrome.storage.local.get(KEY);
    return (data[KEY] as Task[]) || [];
  } catch (err) {
    console.error("Error reading from chrome.storage:", err);
    throw new Error(`Error accessing Chrome Storage: ${(err as Error).message}`, {
      cause: err,
    });
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
    return;
  }
  await chrome.storage.local.set({ [KEY]: tasks });
}

export async function getLanguage(): Promise<Language> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    const lang = localStorage.getItem(LANG_KEY);
    return lang === "en" || lang === "vi" ? lang : "en";
  }

  try {
    const data = await chrome.storage.local.get(LANG_KEY);
    const lang = data[LANG_KEY];
    return lang === "en" || lang === "vi" ? lang : "en";
  } catch (err) {
    console.error("Error reading language from chrome.storage:", err);
    return "en";
  }
}

export async function saveLanguage(lang: Language): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    localStorage.setItem(LANG_KEY, lang);
    return;
  }
  await chrome.storage.local.set({ [LANG_KEY]: lang });
}

const THEME_KEY = "task_tracker_theme";

export async function getTheme(): Promise<Theme> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  }

  try {
    const data = await chrome.storage.local.get(THEME_KEY);
    const saved = data[THEME_KEY];
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  } catch (err) {
    console.error("Error reading theme from chrome.storage:", err);
    return "system";
  }
}

export async function saveTheme(theme: Theme): Promise<void> {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error("Error saving theme to localStorage:", err);
  }

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    await chrome.storage.local.set({ [THEME_KEY]: theme });
  }
}


