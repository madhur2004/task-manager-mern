import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { taskService } from "../services/taskService.js";
import TaskForm from "../components/TaskForm.jsx";
import { IoArrowBackCircleOutline } from "react-icons/io5";
export default function AddTask() {
  const navigate = useNavigate();

  const handleSubmit = async (input) => {
    const created = await taskService.createTask(input);
    navigate(`/tasks/${created._id}`, { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800"
      >
        <IoArrowBackCircleOutline size={25} />
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add Task</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new task.
        </p>
      </div>
      <div className="p-6 card">
        <TaskForm submitLabel="Create Task" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
