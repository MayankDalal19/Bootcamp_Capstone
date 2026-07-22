import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/requests";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDashboardStats()
      .then(({ data }) => mounted && setStats(data.data))
      .catch((err) => mounted && setError(err.response?.data?.message || "Couldn't load your stats."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const completionRate =
    stats && stats.totalWorkouts > 0
      ? Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100)
      : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">01 — Overview</div>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="mono" style={{ color: "var(--muted)" }}>Loading…</p>
      ) : stats ? (
        <>
          <div className="stat-grid">
            <StatCard label="Exercise library" value={stats.totalExercises} />
            <StatCard label="Workouts logged" value={stats.totalWorkouts} />
            <StatCard label="Completed" value={stats.completedWorkouts} accent="var(--green)" />
            <StatCard label="Pending" value={stats.pendingWorkouts} accent="var(--amber)" />
          </div>

          <div className="dashboard-split">
            <div className="card completion-card">
              <div className="eyebrow">Completion rate</div>
              <div className="completion-value mono">{completionRate}%</div>
              <div className="completion-bar">
                <div className="completion-bar-fill" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="completion-note">
                {stats.totalWorkouts === 0
                  ? "Log a workout to start tracking your completion rate."
                  : `${stats.completedWorkouts} of ${stats.totalWorkouts} logged workouts marked done.`}
              </p>
            </div>

            <div className="card recent-card">
              <div className="recent-card-head">
                <div className="eyebrow">Recent workouts</div>
                <Link to="/workouts" className="mono recent-link">View all →</Link>
              </div>
              {stats.recentWorkouts.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 14 }}>Nothing logged yet.</p>
              ) : (
                <div className="recent-list">
                  {stats.recentWorkouts.map((w) => (
                    <div key={w._id} className="recent-item">
                      <span className="mono recent-date">{formatDate(w.workoutDate)}</span>
                      <span className="recent-name">{w.exerciseId?.exerciseName || "Deleted exercise"}</span>
                      <span className={`stamp ${w.completed ? "stamp-done" : "stamp-pending"}`}>
                        {w.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
