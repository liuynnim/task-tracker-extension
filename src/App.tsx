import { useEffect, useState } from "react";
import "./App.css";
import LanguageToggle from "./components/LanguageToggle/LanguageToggle";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { useI18n } from "./i18n/context";
import { getTasks, saveTasks } from "./services/storage";
import type { Task } from "./types/task";

type Tab = "List" | "New";
type Status = "isLoading" | "isSuccess" | "isError";

function App() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [tab, setTab] = useState<Tab>("List");
  const [status, setStatus] = useState<Status>("isLoading");

  useEffect(() => {
    async function loadTasks() {
      try {
        setStatus("isLoading");
        const data = await getTasks();
        setTasks(data);
        setStatus("isSuccess");
      } catch (e) {
        console.error("Error loading task list:", e);
        setStatus("isError");
      }
    }


    loadTasks();
  }, []);

  const handleAddTask = async (newTask: Task) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await saveTasks(updated);
    setTab("List");
  };

  const handleToggleTask = async (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  const handleDeleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await saveTasks(updated);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <ThemeToggle />
        <LanguageToggle />
      </div>






      {status === "isLoading" && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          {t("app.loading")}
        </div>
      )}

      {status === "isError" && (
        <div style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>
          {t("app.error")}
        </div>
      )}

      {status === "isSuccess" && (
        <>
          {tab === "List" ? (
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onAddNew={() => setTab("New")}
            />
          ) : (
            <TaskForm
              onAddTask={handleAddTask}
              onCancel={() => setTab("List")}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
