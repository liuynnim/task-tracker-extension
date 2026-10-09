import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";

interface Props {
  tasks: Array<Task>;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddNew?: () => void;
}

function TaskList({ tasks, onToggle, onDelete, onAddNew }: Props) {
  return (
    <div style={{ padding: "16px", boxSizing: "border-box", textAlign: "left" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
          Danh sách công việc
        </h2>
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Thêm mới
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            color: "#6b7280",
            fontSize: "14px",
            border: "1px dashed #d1d5db",
            borderRadius: "8px",
          }}
        >
          <p>Chưa có công việc nào.</p>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>
            Hãy bấm "+ Thêm mới" để tạo công việc đầu tiên!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              item={task}
              DeleteTask={onDelete}
              setComplete={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
