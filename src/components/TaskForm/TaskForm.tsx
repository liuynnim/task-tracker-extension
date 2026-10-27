import { useI18n } from "../../i18n/context";
import type { Task, TaskFormData } from "../../types/task";
import "./TaskForm.css";
import { useForm } from "../../RHF/useForm";

interface Props {
  onAddTask?: (task: Task) => void;
  onCancel?: () => void;
}

function TaskForm({ onAddTask, onCancel }: Props) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { title: "", description: "", dueDate: "" },
  });

  const onSubmit = (data: TaskFormData) => {
    const timestamp = Date.now().toString();
    const newTask: Task = {
      id: timestamp,
      title: data.title,
      description: data.description || "",
      dueDate: data.dueDate || "",
      completed: false,
      createdAt: timestamp,
    };

    onAddTask?.(newTask);
    reset();
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

      <form
        className="task-form"
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <div className="form-field">
          <label htmlFor="title">{t("taskForm.titleLabel")}</label>
          <input
            id="title"
            type="text"
            className={`form-input ${errors.title ? "has-error" : ""}`}
            placeholder={t("taskForm.titlePlaceholder")}
            autoFocus
            {...register("title", {
              required: t("taskForm.titleError"),
            })}
          />
          {errors.title && (
            <span className="form-error">{errors.title.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="des">{t("taskForm.descLabel")}</label>
          <textarea
            id="des"
            className="form-textarea"
            placeholder={t("taskForm.descPlaceholder")}
            {...register("description")}
          />
        </div>

        <div className="form-field">
          <label htmlFor="duaDate">{t("taskForm.dueDateLabel")}</label>
          <input
            id="duaDate"
            type="date"
            className="form-input"
            {...register("dueDate")}
          />
        </div>

        <button type="submit" className="btn-submit">
          {t("taskForm.submitBtn")}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;

