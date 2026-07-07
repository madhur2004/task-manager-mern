import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";
import { PriorityBadge, StatusBadge } from "./FormControls.jsx";
import { parseDate, formatDisplayDate } from "../utils/dateHelpers.js";
import { FaRegEdit } from "react-icons/fa";
import { TbHttpDeleteOff } from "react-icons/tb";
const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "Completed") return false;

  const dueDate = parseDate(dateStr);

  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  if (!task) return null;

  const completed = task.status === "Completed";
  const overdue = isOverdue(task.dueDate, task.status);

  const taskTitle = task.title?.trim() || "Untitled Task";

  const handleToggleStatus = () => {
    onToggleStatus?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task);
  };

  return (
    <div className="flex flex-col gap-3 p-5 card animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/tasks/${task._id}`}
          className="text-base font-semibold text-gray-800 transition-colors line-clamp-2 hover:text-blue-600"
        >
          {taskTitle}
        </Link>

        <button
          type="button"
          onClick={handleToggleStatus}
          className="text-gray-400 transition-colors shrink-0 hover:text-blue-600"
          title={completed ? "Mark as Pending" : "Mark as Completed"}
          aria-label={completed ? "Mark as Pending" : "Mark as Completed"}
        >
          {completed ? (
            <CheckCircle2 size={20} className="text-green-500" />
          ) : (
            <Circle size={20} />
          )}
        </button>
      </div>

      {task.description?.trim() && (
        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>

      {task.dueDate && (
        <div
          className={`flex items-center gap-1.5 text-xs ${
            overdue ? "text-red-600" : "text-gray-500"
          }`}
        >
          <CalendarDays size={14} />

          <span>{formatDisplayDate(task.dueDate)}</span>

          {overdue && <span className="font-medium">• Overdue</span>}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <Link
          to={`/tasks/${task._id}/edit`}
          className="flex items-center gap-1 px-2 py-1 text-xs btn-ghost"
          title="Edit Task"
          aria-label={`Edit ${taskTitle}`}
        >
          <FaRegEdit size={25} />
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 btn-ghost hover:bg-red-50"
          title="Delete Task"
          aria-label={`Delete ${taskTitle}`}
        >
          <TbHttpDeleteOff size={25} />
        </button>
      </div>
    </div>
  );
};

export default memo(TaskCard);
