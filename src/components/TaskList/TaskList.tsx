import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";
import { useI18n } from "../../i18n/context";
import "./TaskList.css";

interface Props {
  tasks: Array<Task>;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddNew?: () => void;
}

function TaskList({ tasks, onToggle, onDelete, onAddNew }: Props) {
  const { t } = useI18n();

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2 className="task-list-title">{t("taskList.title")}</h2>
        {onAddNew && (
          <button type="button" onClick={onAddNew} className="btn-add-new">
            {t("taskList.addNew")}
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <p className="task-list-empty-title">{t("taskList.empty")}</p>
          <p className="task-list-empty-sub">{t("taskList.emptySub")}</p>
        </div>
      ) : (
        <div className="task-list-items">
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
