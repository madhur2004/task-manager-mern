export default function StatCard({ label, value, accent }) {
  return (
    <div className="p-4 card">
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <p className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
