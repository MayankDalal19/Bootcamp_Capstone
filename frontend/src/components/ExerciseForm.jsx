import { useState } from "react";

const EMPTY = {
  exerciseName: "",
  muscleGroup: "",
  difficulty: "Beginner",
  description: "",
  duration: "",
};

export default function ExerciseForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.exerciseName || !form.muscleGroup || !form.description || !form.duration) {
      setError("Fill in every field before saving.");
      return;
    }
    try {
      await onSubmit({ ...form, duration: Number(form.duration) });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save this exercise.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="exerciseName">Exercise name</label>
        <input
          id="exerciseName"
          name="exerciseName"
          value={form.exerciseName}
          onChange={handleChange}
          placeholder="Push Ups"
        />
      </div>

      <div className="field">
        <label htmlFor="muscleGroup">Muscle group</label>
        <input
          id="muscleGroup"
          name="muscleGroup"
          value={form.muscleGroup}
          onChange={handleChange}
          placeholder="Chest"
        />
      </div>

      <div className="field">
        <label htmlFor="difficulty">Difficulty</label>
        <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="duration">Duration (minutes)</label>
        <input
          id="duration"
          name="duration"
          type="number"
          min="1"
          value={form.duration}
          onChange={handleChange}
          placeholder="10"
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Standard push ups, hands shoulder-width apart"
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
          {submitting ? "Saving…" : "Save exercise"}
        </button>
      </div>
    </form>
  );
}
