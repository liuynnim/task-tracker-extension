import { useState } from "react";
import { useI18n } from "../../i18n/context";
import type { Task } from "../../types/task";
import "./TaskForm.css";

interface Props {
  onAddTask?: (task: Task) => void;
  onCancel?: () => void;
}

function TaskForm({ onAddTask, onCancel }: Props) {
  const { t } = useI18n();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [error, setError] = useState<{
    title: string;
    description: string;
    dueDate: string;
  }>({ title: "", description: "", dueDate: "" });

  const addTask = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError((prev) => ({ ...prev, title: t("taskForm.titleError") }));
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description,
      dueDate,
      completed: false,
      createdAt: Date.now().toString(),
    };
    onAddTask?.(newTask);
    setTitle("");
    setDescription("");
    setDueDate("");
    setError({ title: "", description: "", dueDate: "" });
  };

  return (
    <div className="task-form-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <h3 className="task-form-heading" style={{ margin: 0 }}>
          {t("taskForm.heading")}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "13px",
              padding: "4px 8px",
            }}
          >
            {t("taskForm.back")}
          </button>
        )}
      </div>
      <form className="task-form" onSubmit={addTask}>
        <div className="form-field">
          <label htmlFor="title">{t("taskForm.titleLabel")}</label>
          <input
            id="title"
            type="text"
            className={`form-input ${error.title ? "has-error" : ""}`}
            value={title}
            placeholder={t("taskForm.titlePlaceholder")}
            autoFocus
            onChange={(e) => {
              setTitle(e.target.value);
              if (error.title) {
                setError((prev) => ({ ...prev, title: "" }));
              }
            }}
          />
          {error.title && <span className="form-error">{error.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="des">{t("taskForm.descLabel")}</label>
          <textarea
            id="des"
            className={`form-textarea ${error.description ? "has-error" : ""}`}
            value={description}
            placeholder={t("taskForm.descPlaceholder")}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error.description) {
                setError((prev) => ({ ...prev, description: "" }));
              }
            }}
          />
          {error.description && (
            <span className="form-error">{error.description}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="duaDate">{t("taskForm.dueDateLabel")}</label>
          <input
            id="duaDate"
            type="date"
            className={`form-input ${error.dueDate ? "has-error" : ""}`}
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (error.dueDate) {
                setError((prev) => ({ ...prev, dueDate: "" }));
              }
            }}
          />
          {error.dueDate && <span className="form-error">{error.dueDate}</span>}
        </div>

        <button type="submit" className="btn-submit">
          {t("taskForm.submitBtn")}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
