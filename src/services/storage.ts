import type { Language } from "../i18n/types";
import type { Task } from "../types/task";

const KEY = "task_tracker_items";
const LANG_KEY = "task_tracker_language";

export async function getTasks(): Promise<Task[]> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("Lỗi khi đọc từ localStorage:", err);
      throw new Error("Không thể đọc dữ liệu từ localStorage", { cause: err });
    }
  }

  try {
    const data = await chrome.storage.local.get(KEY);
    return (data[KEY] as Task[]) || [];
  } catch (err) {
    console.error("Lỗi khi đọc từ chrome.storage:", err);
    throw new Error(`Lỗi truy xuất Chrome Storage: ${(err as Error).message}`, {
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
    console.error("Lỗi khi đọc ngôn ngữ từ chrome.storage:", err);
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
