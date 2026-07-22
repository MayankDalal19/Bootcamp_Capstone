import { useEffect, useState } from "react";
import {
  listExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../api/requests";
import Modal from "../components/Modal";
import ExerciseForm from "../components/ExerciseForm";
import "./Exercises.css";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await listExercises();
      setExercises(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load exercises.");
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

  const openEdit = (exercise) => {
    setEditing(exercise);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        const { data } = await updateExercise(editing._id, payload);
        setExercises((prev) => prev.map((ex) => (ex._id === editing._id ? data.data : ex)));
      } else {
        const { data } = await createExercise(payload);
        setExercises((prev) => [data.data, ...prev]);
      }
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exercise? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this exercise.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">02 — Library</div>
          <h1>Exercises</h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New exercise
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="mono" style={{ color: "var(--muted)" }}>Loading…</p>
      ) : exercises.length === 0 ? (
        <div className="empty-state card">
          <h3>No exercises logged yet</h3>
          <p>Add the moves you train so you can attach them to workouts.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>
            + New exercise
          </button>
        </div>
      ) : (
        <div className="exercise-grid">
          {exercises.map((ex) => (
            <div key={ex._id} className="exercise-card card">
              <div className="exercise-card-top">
                <span className={`difficulty difficulty-${ex.difficulty}`}>{ex.difficulty}</span>
                <span className="mono exercise-duration">{ex.duration}′</span>
              </div>
              <h3 style={{ fontSize: 17, marginTop: 10 }}>{ex.exerciseName}</h3>
              <div className="eyebrow" style={{ marginTop: 4 }}>{ex.muscleGroup}</div>
              <p className="exercise-desc">{ex.description}</p>
              <div className="exercise-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(ex)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(ex._id)}
                  disabled={deletingId === ex._id}
                >
                  {deletingId === ex._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit exercise" : "New exercise"} onClose={() => setModalOpen(false)}>
          <ExerciseForm
            initial={editing || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
