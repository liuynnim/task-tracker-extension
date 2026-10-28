import { useState } from "react";
import { useI18n } from "../../i18n/context";
import type { Task } from "../../types/task";
import "./TaskItem.css";

interface Props {
  item: Task;
  setComplete?: (id: string) => void;
  DeleteTask?: (id: string) => void;
}

function TaskItem({ item, DeleteTask, setComplete }: Props) {
  const { t, language } = useI18n();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(isNaN(Number(dateStr)) ? dateStr : Number(dateStr));
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US");
  };

  return (
    <div className={`task-item ${item.completed ? "is-completed" : ""}`}>
      {/* Collapsed view: Checkbox + Title + Expand icon */}
      <div
        className="task-header"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <input
          type="checkbox"
          className="task-checkbox"
          checked={item.completed}
          onChange={(e) => {
            e.stopPropagation();
            setComplete?.(item.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <p className="task-title">{item.title}</p>

        <span className={`expand-icon ${isExpanded ? "rotated" : ""}`}>
          ▶
        </span>
      </div>

      {/* Expanded view: Detailed information */}
      {isExpanded && (

        <div className="task-details">
          <div className="detail-row">
            <span className="detail-label">{t("taskItem.descLabel")}</span>
            {item.description ? (
              <p className="detail-content">{item.description}</p>
            ) : (
              <p className="detail-content empty">{t("taskItem.noDesc")}</p>
            )}
          </div>

          <div className="task-meta">
            {item.dueDate && (
              <span className="task-meta-item">
                📅 {t("taskItem.dueDate", { date: formatDate(item.dueDate) })}
              </span>
            )}
            {item.createdAt && (
              <span className="task-meta-item">
                🕒 {t("taskItem.createdAt", { date: formatDate(item.createdAt) })}
              </span>
            )}
          </div>

          {DeleteTask && (
            <div className="task-actions">
              <button
                type="button"
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  DeleteTask(item.id);
                }}
              >
                {t("taskItem.deleteBtn")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskItem;
