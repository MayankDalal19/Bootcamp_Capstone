import { useEffect, useState } from "react";
import {
  listWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  listExercises,
} from "../api/requests";
import Modal from "../components/Modal";
import WorkoutForm from "../components/WorkoutForm";
import "./Workouts.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [workoutsRes, exercisesRes] = await Promise.all([listWorkouts(), listExercises()]);
      setWorkouts(workoutsRes.data.data);
      setExercises(exercisesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (workout) => {
    setEditing(workout);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        const { data } = await updateWorkout(editing._id, payload);
        setWorkouts((prev) => prev.map((w) => (w._id === editing._id ? data.data : w)));
      } else {
        const { data } = await createWorkout(payload);
        setWorkouts((prev) => [data.data, ...prev]);
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout entry?")) return;
    setDeletingId(id);
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this workout.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCompleted = async (workout) => {
    setTogglingId(workout._id);
    try {
      const { data } = await updateWorkout(workout._id, { completed: !workout.completed });
      setWorkouts((prev) => prev.map((w) => (w._id === workout._id ? data.data : w)));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update this workout.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">03 — Log</div>
          <h1>Workouts</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate} disabled={exercises.length === 0 && !loading}>
          + Log workout
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && exercises.length === 0 && (
        <div className="alert" style={{ background: "#f2e6cf", borderColor: "var(--amber)", color: "var(--amber)" }}>
          Add an exercise first — workouts are logged against exercises in your library.
        </div>
      )}

      {loading ? (
        <p className="mono" style={{ color: "var(--muted)" }}>Loading…</p>
      ) : workouts.length === 0 ? (
        <div className="empty-state card">
          <h3>No workouts logged yet</h3>
          <p>Log your first session and start building your training history.</p>
        </div>
      ) : (
        <div className="ledger card">
          <div className="ledger-row ledger-head eyebrow">
            <span>Date</span>
            <span>Exercise</span>
            <span>Status</span>
            <span>Notes</span>
            <span></span>
          </div>
          {workouts.map((w) => (
            <div key={w._id} className="ledger-row">
              <span className="mono ledger-date">{formatDate(w.workoutDate)}</span>
              <span className="ledger-exercise">
                <strong>{w.exerciseId?.exerciseName || "Deleted exercise"}</strong>
                <span className="eyebrow">{w.exerciseId?.muscleGroup}</span>
              </span>
              <span>
                <button
                  className={`stamp ${w.completed ? "stamp-done" : "stamp-pending"}`}
                  style={{ border: "1.5px solid currentColor", cursor: "pointer" }}
                  onClick={() => toggleCompleted(w)}
                  disabled={togglingId === w._id}
                >
                  {togglingId === w._id ? "…" : w.completed ? "Done" : "Pending"}
                </button>
              </span>
              <span className="ledger-notes">{w.notes || "—"}</span>
              <span className="ledger-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(w)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(w._id)}
                  disabled={deletingId === w._id}
                >
                  {deletingId === w._id ? "…" : "Delete"}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit workout" : "Log workout"} onClose={() => setModalOpen(false)}>
          <WorkoutForm
            initial={editing || undefined}
            exercises={exercises}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
