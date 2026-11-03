import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiCheckSquare,
  FiSend,
  FiCheckCircle,
  FiFilter,
  FiCode,
  FiStar
} from "react-icons/fi";

export default function DepartmentTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(user?.department || "Software Engineering");

  // Submission modal
  const [activeTask, setActiveTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/confidence/assignments");
      // Filter for department-specific tasks
      const deptTasks = res.data.assignments.filter(
        (a) => a.template && a.template.category === "department-specific"
      );
      setTasks(deptTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenSubmission = (task) => {
    setActiveTask(task);
    setSubmissionText(task.submissionText || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeTask) return;
    setSubmitting(true);
    try {
      await api.patch(`/confidence/assignments/${activeTask._id}/submit`, {
        submissionText,
        status: "submitted"
      });
      setActiveTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const depts = [
    "Software Engineering",
    "Human Resources",
    "Marketing",
    "Business Analysis",
    "UI/UX Design"
  ];

  return (
    <div>
      <div className="hero-banner mb-4">
        <div className="badge bg-white bg-opacity-25 text-white px-3 py-1 mb-2">
          <FiCode className="me-1" /> SPECIALIZED SKILLS CURRICULUM
        </div>
        <h2 className="fw-bold mb-2">Department-Specific Training Tasks</h2>
        <p className="text-white-50 mb-0" style={{ maxWidth: 720 }}>
          Master the exact practical responsibilities and deliverables expected in your discipline,
          from debugging codebase issues to drafting onboarding guides and designing wireframes.
        </p>
      </div>

      <div className="row g-3">
        {tasks.map((item) => {
          const tpl = item.template;
          return (
            <div className="col-lg-6" key={item._id}>
              <div className={`content-card p-4 h-100 d-flex flex-column justify-content-between day-card ${item.status}`}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {tpl.department}
                    </span>
                    <span
                      className={`badge small ${
                        item.status === "completed"
                          ? "bg-success"
                          : item.status === "submitted"
                          ? "bg-info text-dark"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{tpl.title}</h5>
                  <p className="text-secondary small mb-2">{tpl.description}</p>

                  <div className="p-3 bg-light rounded-3 mb-3 small">
                    <strong className="text-dark">Instructions:</strong>
                    <div className="text-muted mt-1">{tpl.instructions}</div>
                  </div>

                  {item.submissionText && (
                    <div className="p-2 mb-2 rounded bg-white border border-primary border-opacity-25 small">
                      <strong className="text-primary d-block">Your Submission:</strong>
                      <span className="text-secondary">{item.submissionText}</span>
                    </div>
                  )}

                  {item.feedback && (
                    <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 mb-3 small">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-success">Manager Evaluation:</strong>
                        {item.rating && (
                          <div className="text-warning">
                            {[...Array(item.rating)].map((_, i) => (
                              <FiStar key={i} className="fill-current" style={{ fill: "#f59e0b" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-dark fst-italic">"{item.feedback}"</div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted">
                    Difficulty: <strong className="text-capitalize">{tpl.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => handleOpenSubmission(item)}
                    className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                  >
                    <FiSend size={13} />
                    {item.status === "completed" ? "Update Work" : "Submit Work"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {activeTask && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <span className="badge bg-primary mb-1">{activeTask.template?.department}</span>
                  <h5 className="modal-title fw-bold">{activeTask.template?.title}</h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveTask(null)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <p className="small text-secondary mb-1">
                      <strong>Requirement:</strong> {activeTask.template?.description}
                    </p>
                    <p className="small text-muted mb-0">
                      <strong>Instructions:</strong> {activeTask.template?.instructions}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Your Practical Submission / Deliverable
                    </label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Paste your solution code, requirements document, post draft, or architecture notes..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setActiveTask(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit to Manager"}
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
