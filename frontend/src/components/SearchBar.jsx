import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search tasks by title or description..."
        className="w-full py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
