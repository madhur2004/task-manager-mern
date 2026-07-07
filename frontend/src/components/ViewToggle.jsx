import { LayoutGrid, Table } from "lucide-react";

export default function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => setViewMode("card")}
        className={`p-1.5 rounded-md transition-colors ${
          viewMode === "card"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Card View"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => setViewMode("table")}
        className={`p-1.5 rounded-md transition-colors ${
          viewMode === "table"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Table View"
      >
        <Table size={18} />
      </button>
    </div>
  );
}
