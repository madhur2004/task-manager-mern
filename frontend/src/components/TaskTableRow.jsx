import { Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { PriorityBadge, StatusBadge } from "./FormControls.jsx";

export default function TaskTableRow({
  task,
  onToggleStatus,
  onDelete,
  navigate,
}) {
  const completed = task.status === "Completed";

  // Format date for display
  const dueDate = task.dueDate
    ? new Date(task.dueDate.split("/").reverse().join("-")).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric", year: "numeric" },
      )
    : "—";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
        <button
          onClick={() => navigate(`/tasks/${task._id}`)}
          className="hover:text-blue-600 hover:underline"
        >
          {task.title}
        </button>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {dueDate}
      </td>
      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onToggleStatus(task)}
            className="text-gray-400 transition-colors hover:text-blue-600"
            title={completed ? "Mark as Pending" : "Mark as Completed"}
          >
            {completed ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <Circle size={18} />
            )}
          </button>
          <button
            onClick={() => navigate(`/tasks/${task._id}/edit`)}
            className="text-gray-400 transition-colors hover:text-gray-700"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-gray-400 transition-colors hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
