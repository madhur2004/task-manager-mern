const baseField =
  "w-full border rounded-lg p-2 text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

export function FieldWrapper({ label, error, id, required, children }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input({ label, error, id, className = "", required, ...rest }) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} id={inputId} required={required}>
      <input
        id={inputId}
        className={`${baseField} ${error ? "border-red-400" : "border-gray-300"} ${className}`}
        required={required}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  required,
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} id={inputId} required={required}>
      <textarea
        id={inputId}
        className={`${baseField} ${error ? "border-red-400" : "border-gray-300"} resize-y min-h-[96px] ${className}`}
        required={required}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  id,
  options,
  className = "",
  required,
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <FieldWrapper label={label} error={error} id={inputId} required={required}>
      <select
        id={inputId}
        className={`${baseField} ${error ? "border-red-400" : "border-gray-300"} bg-white ${className}`}
        required={required}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

const priorityStyles = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-700",
};

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${priorityStyles[priority]}`}>{priority}</span>
  );
}

export function StatusBadge({ status }) {
  return <span className={`badge ${statusStyles[status]}`}>{status}</span>;
}
