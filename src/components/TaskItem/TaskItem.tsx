import { useState } from "react";
import type { Task } from "../../types/task";
import "./TaskItem.css";

interface Props {
  item: Task;
  setComplete?: (id: string) => void;
  DeleteTask?: (id: string) => void;
}

function TaskItem({ item, DeleteTask, setComplete }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(isNaN(Number(dateStr)) ? dateStr : Number(dateStr));
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className={`task-item ${item.completed ? "is-completed" : ""}`}>
      {/* Phần thu gọn: Checkbox + Tiêu đề + Icon mở rộng */}
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

      {/* Phần mở rộng: Chi tiết thông tin */}
      {isExpanded && (
        <div className="task-details">
          <div className="detail-row">
            <span className="detail-label">Mô tả</span>
            {item.description ? (
              <p className="detail-content">{item.description}</p>
            ) : (
              <p className="detail-content empty">(Không có mô tả)</p>
            )}
          </div>

          <div className="task-meta">
            {item.dueDate && (
              <span className="task-meta-item">
                📅 Hạn chót: <strong>{formatDate(item.dueDate)}</strong>
              </span>
            )}
            {item.createdAt && (
              <span className="task-meta-item">
                🕒 Tạo lúc: {formatDate(item.createdAt)}
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
                Xóa công việc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskItem;
