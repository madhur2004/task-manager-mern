import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListTodo, Plus } from "lucide-react";
import { MdAddTask } from "react-icons/md";
import { taskService } from "../services/taskService.js";
import TaskCard from "../components/TaskCard.jsx";
import Modal from "../components/Modal.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
} from "../components/FeedbackStates.jsx";
import StatCard from "../components/StatCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ViewToggle from "../components/ViewToggle.jsx";
import Pagination from "../components/Pagination.jsx";
import TaskTableRow from "../components/TaskTableRow.jsx";

const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    const term = searchTerm.toLowerCase().trim();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term)),
    );
  }, [tasks, searchTerm]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, currentPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleToggleStatus = useCallback(
    async (task) => {
      const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
      const previous = tasks;
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: nextStatus } : t,
        ),
      );
      try {
        await taskService.updateTask(task._id, { status: nextStatus });
      } catch {
        setTasks(previous);
        setError("Failed to update status. Please try again.");
      }
    },
    [tasks],
  );

  const handleDelete = useCallback(async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    const previous = tasks;
    const target = taskToDelete;
    setTasks((prev) => prev.filter((t) => t._id !== target._id));
    setTaskToDelete(null);
    try {
      await taskService.deleteTask(target._id);
    } catch {
      setTasks(previous);
      setError("Failed to delete task. Please try again.");
    } finally {
      setDeleting(false);
    }
  }, [taskToDelete, tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    return { total, completed, inProgress, pending };
  }, [tasks]);

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Your Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your tasks in one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/tasks/new")}
          className="self-start btn-primary sm:self-auto"
        >
          <MdAddTask size={25} />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total" value={stats.total} accent="text-gray-900" />

        <StatCard label="Pending" value={stats.pending} accent="text-red-800" />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          accent="text-yellow-600"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          accent="text-green-600"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={clearSearch}
        />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingScreen label="Loading your tasks..." />
      ) : error && tasks.length === 0 ? (
        <ErrorState message={error} onRetry={loadTasks} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No matching tasks" : "No tasks yet"}
          message={
            searchTerm
              ? "Try adjusting your search terms."
              : "Create your first task to start organizing your work."
          }
          actionLabel={searchTerm ? "Clear Search" : "Add Task"}
          onAction={searchTerm ? clearSearch : () => navigate("/tasks/new")}
          icon={<ListTodo size={28} />}
        />
      ) : (
        <>
          {error && (
            <div className="px-3 py-2 text-sm border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
              {error}
            </div>
          )}

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onDelete={setTaskToDelete}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedTasks.map((task) => (
                    <TaskTableRow
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onDelete={setTaskToDelete}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTasks.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

      {/* Delete Modal */}
      <Modal
        open={!!taskToDelete}
        title="Delete task?"
        onClose={() => setTaskToDelete(null)}
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setTaskToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              Delete
            </button>
          </>
        }
      >
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-800">{taskToDelete?.title}</span>
        ? This action cannot be undone.
      </Modal>
    </div>
  );
}
