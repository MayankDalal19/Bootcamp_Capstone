import { useState } from "react";

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function WorkoutForm({ initial, exercises, onSubmit, onCancel, submitting }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial
      ? {
          exerciseId: initial.exerciseId?._id || initial.exerciseId,
          workoutDate: toDateInput(initial.workoutDate),
          notes: initial.notes || "",
          completed: initial.completed || false,
        }
      : {
          exerciseId: exercises[0]?._id || "",
          workoutDate: toDateInput(new Date()),
          notes: "",
          completed: false,
        }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.exerciseId || !form.workoutDate) {
      setError("Pick an exercise and a date before saving.");
      return;
    }
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save this workout.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="exerciseId">Exercise</label>
        <select
          id="exerciseId"
          name="exerciseId"
          value={form.exerciseId}
          onChange={handleChange}
          disabled={isEdit}
        >
          {exercises.length === 0 && <option value="">No exercises yet</option>}
          {exercises.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.exerciseName} — {ex.muscleGroup}
            </option>
          ))}
        </select>
        {isEdit && (
          <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
            Exercise can't be changed after logging — delete and re-add if needed.
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="workoutDate">Date</label>
        <input
          id="workoutDate"
          name="workoutDate"
          type="date"
          value={form.workoutDate}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Felt strong today, upped the reps"
        />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} />
        Mark as completed
      </label>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || (!isEdit && exercises.length === 0)}
          style={{ flex: 1 }}
        >
          {submitting ? "Saving…" : "Save workout"}
        </button>
      </div>
    </form>
  );
}
