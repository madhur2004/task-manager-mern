import { useEffect, useState } from "react";
import { Input, Select, Textarea } from "./FormControls.jsx";
import { Spinner } from "./FeedbackStates.jsx";
import { toInputDate, toBackendDate } from "../utils/dateHelpers.js";

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

// Local date (avoids UTC timezone issues)
const todayStr = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
};

export default function TaskForm({
  initial = null,
  submitLabel = "Save Task",
  onSubmit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(todayStr());
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Sync form whenever initial changes
  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setDueDate(initial?.dueDate ? toInputDate(initial.dueDate) : todayStr());
    setPriority(initial?.priority ?? "Medium");
    setStatus(initial?.status ?? "Pending");

    setErrors({});
    setFormError("");
  }, [initial]);

  const validate = () => {
    const next = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      next.title = "Title is required";
    } else if (trimmedTitle.length > 100) {
      next.title = "Title must be 100 characters or fewer";
    }

    if (!dueDate) {
      next.dueDate = "Due date is required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setFormError("");

    if (!validate()) return;

    if (typeof onSubmit !== "function") {
      setFormError("Submit handler is missing.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        dueDate: toBackendDate(dueDate),
        priority,
        status,
      };

      await onSubmit(payload);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to save task.";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Prepare quarterly report"
        error={errors.title}
        required
        maxLength={100}
        disabled={submitting}
      />

      <Textarea
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add details about this task..."
        disabled={submitting}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
          required
          disabled={submitting}
        />

        <Select
          label="Priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={priorityOptions}
          disabled={submitting}
        />

        <Select
          label="Status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          disabled={submitting}
        />
      </div>

      {formError && (
        <div
          className="px-3 py-2 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50"
          role="alert"
        >
          {formError}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 btn-primary"
          disabled={submitting}
        >
          {submitting && <Spinner />}
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
