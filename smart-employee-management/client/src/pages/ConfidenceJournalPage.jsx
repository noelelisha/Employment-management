import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiEdit3,
  FiPlus,
  FiCalendar,
  FiSmile,
  FiCheckCircle,
  FiTrendingUp
} from "react-icons/fi";

export default function ConfidenceJournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Journal form state
  const [form, setForm] = useState({
    learnedToday: "",
    completedToday: "",
    challengesFaced: "",
    improveTomorrow: "",
    mood: "confident"
  });
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await api.get("/journal");
      setEntries(res.data.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/journal", form);
      setShowModal(false);
      setForm({
        learnedToday: "",
        completedToday: "",
        challengesFaced: "",
        improveTomorrow: "",
        mood: "confident"
      });
      fetchEntries();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save journal entry");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero-banner mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="badge bg-white bg-opacity-25 text-white px-3 py-1 mb-2">
            <FiEdit3 className="me-1" /> DAILY REFLECTIVE PRACTICE
          </div>
          <h2 className="fw-bold mb-1">Confidence & Reflection Journal</h2>
          <p className="text-white-50 mb-0" style={{ maxWidth: 680 }}>
            Track your daily learnings, celebrate completed milestones, identify bottlenecks, and set
            clear focus intentions for tomorrow. Consistent reflection builds unstoppable confidence.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-light fw-semibold text-primary shadow-sm d-flex align-items-center gap-2"
        >
          <FiPlus /> New Daily Entry
        </button>
      </div>

      <div className="row g-4">
        {entries.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FiSmile size={48} className="text-primary mb-3" />
            <h5 className="fw-bold text-dark">No Journal Entries Yet</h5>
            <p className="text-muted small mb-3">
              Start building your workplace confidence record by adding your first daily reflection.
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Write Today's Entry
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <div className="col-md-6 col-xl-4" key={entry._id}>
              <div className="content-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary d-flex align-items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    <span className="badge bg-light text-secondary border text-capitalize">
                      Mood: {entry.mood}
                    </span>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: "0.7rem" }}>
                      1. What I Learned Today:
                    </small>
                    <p className="small text-dark mb-0 bg-light p-2 rounded-2">
                      {entry.learnedToday}
                    </p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: "0.7rem" }}>
                      2. What I Completed:
                    </small>
                    <p className="small text-dark mb-0 bg-light p-2 rounded-2">
                      {entry.completedToday}
                    </p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: "0.7rem" }}>
                      3. Challenges Faced:
                    </small>
                    <p className="small text-dark mb-0 bg-light p-2 rounded-2">
                      {entry.challengesFaced}
                    </p>
                  </div>

                  <div className="mb-0">
                    <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: "0.7rem" }}>
                      4. What I Want to Improve Tomorrow:
                    </small>
                    <p className="small text-primary mb-0 bg-primary bg-opacity-10 p-2 rounded-2 fw-medium">
                      {entry.improveTomorrow}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-top mt-3 text-end text-muted small" style={{ fontSize: "0.72rem" }}>
                  Recorded at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Journal Entry Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Daily Confidence Reflection</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    Take 5 minutes to reflect on today's progress. Be honest and celebrate small wins!
                  </p>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      1. What did you learn today?
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Learned how MongoDB indexes improve query performance and how to create compound indexes..."
                      value={form.learnedToday}
                      onChange={(e) => setForm({ ...form, learnedToday: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      2. What did you complete or deliver?
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Finished Day 4 task, reached out to 3 colleagues, and updated my sprint tickets..."
                      value={form.completedToday}
                      onChange={(e) => setForm({ ...form, completedToday: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      3. What challenges or roadblocks did you face?
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Struggled with a CORS issue when connecting frontend to backend..."
                      value={form.challengesFaced}
                      onChange={(e) => setForm({ ...form, challengesFaced: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      4. What do you want to improve or focus on tomorrow?
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Ask manager for guidance on API schema validation and test with Postman..."
                      value={form.improveTomorrow}
                      onChange={(e) => setForm({ ...form, improveTomorrow: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">How do you feel today?</label>
                    <select
                      className="form-select"
                      value={form.mood}
                      onChange={(e) => setForm({ ...form, mood: e.target.value })}
                    >
                      <option value="confident">Confident & Growing</option>
                      <option value="motivated">Highly Motivated</option>
                      <option value="neutral">Neutral & Steady</option>
                      <option value="overwhelmed">Slightly Overwhelmed (Need guidance)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold" disabled={saving}>
                    {saving ? "Saving..." : "Save Reflection Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
