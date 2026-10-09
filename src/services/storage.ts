import type { Task } from "../types/task";

const KEY = "task_tracker_items";

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
