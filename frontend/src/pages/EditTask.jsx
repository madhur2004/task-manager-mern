import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { taskService } from "../services/taskService.js";
import TaskForm from "../components/TaskForm.jsx";
import { ErrorState, LoadingScreen } from "../components/FeedbackStates.jsx";
import { IoArrowBackCircleOutline } from "react-icons/io5";
export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Task ID is missing.");
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getTask(id);
        if (active) setTask(data);
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (input) => {
    if (!id) return;
    await taskService.updateTask(id, input);
    navigate(`/tasks/${id}`, { replace: true });
  };

  if (loading) return <LoadingScreen label="Loading task..." />;
  if (error || !task)
    return (
      <ErrorState
        message={error ?? "Task not found"}
        onRetry={() => navigate("/")}
      />
    );

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      <Link
        to={`/tasks/${task._id}`}
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
      >
        <IoArrowBackCircleOutline size={25} />
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the details of your task.
        </p>
      </div>
      <div className="p-6 card">
        <TaskForm
          initial={task}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
