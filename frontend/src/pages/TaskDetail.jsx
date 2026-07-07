import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";
import { taskService } from "../services/taskService.js";
import { PriorityBadge, StatusBadge } from "../components/FormControls.jsx";
import Modal from "../components/Modal.jsx";
import { ErrorState, LoadingScreen } from "../components/FeedbackStates.jsx";
import { formatDisplayDate } from "../utils/dateHelpers.js";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { TbHttpDeleteOff } from "react-icons/tb";
export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setError("Task ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await taskService.getTask(id);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = useCallback(async () => {
    if (!task) return;

    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";

    // Optimistic Update
    setTask((prev) =>
      prev
        ? {
            ...prev,
            status: nextStatus,
          }
        : prev,
    );

    try {
      await taskService.updateTask(task._id, {
        status: nextStatus,
      });
    } catch {
      setTask(task);
      setError("Failed to update status.");
    }
  }, [task]);

  const handleDelete = useCallback(async () => {
    if (!task) return;

    setDeleting(true);

    try {
      await taskService.deleteTask(task._id);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }, [task, navigate]);

  if (loading) {
    return <LoadingScreen label="Loading task..." />;
  }

  if (error || !task) {
    return (
      <ErrorState
        message={error ?? "Task not found"}
        onRetry={() => navigate("/")}
      />
    );
  }

  const completed = task.status === "Completed";

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
      >
        <IoArrowBackCircleOutline size={25} />
      </Link>

      <div className="p-6 card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <button
              onClick={handleToggle}
              className="text-gray-400 transition-colors hover:text-blue-600 mt-0.5"
              title={completed ? "Mark as Pending" : "Mark as Completed"}
              aria-label={completed ? "Mark as Pending" : "Mark as Completed"}
            >
              {completed ? (
                <CheckCircle2 size={22} className="text-green-500" />
              ) : (
                <Circle size={22} />
              )}
            </button>

            <div>
              <h1
                className={`text-xl font-semibold ${
                  completed ? "text-gray-400 line-through" : "text-gray-900"
                }`}
              >
                {task.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link to={`/tasks/${task._id}/edit`} className="btn-secondary">
              <FaRegEdit size={25} />
            </Link>

            <button onClick={() => setConfirmOpen(true)} className="btn-danger">
              <TbHttpDeleteOff size={25} />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h2 className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Description
            </h2>

            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <CalendarDays size={16} />
            <span>Due {formatDisplayDate(task.dueDate)}</span>
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Delete task?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-800">{task.title}</span>? This
        action cannot be undone.
      </Modal>
    </div>
  );
}
