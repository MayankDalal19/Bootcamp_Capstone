export default function StatCard({ label, value, accent }) {
  return (
    <div className="card stat-card">
      <div className="eyebrow">{label}</div>
      <div className="stat-value mono" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
    </div>
  );
}
