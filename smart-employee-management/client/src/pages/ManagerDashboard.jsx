import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiFolder,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiPlus,
  FiAward
} from "react-icons/fi";

export default function ManagerDashboard() {
  const [summary, setSummary] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for review
  const [selectedTask, setSelectedTask] = useState(null);
  const [reviewForm, setReviewForm] = useState({ feedback: "", rating: 5, status: "completed" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchData = async () => {
    try {
      const [sumRes, revRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/confidence/reviews/pending")
      ]);
      setSummary(sumRes.data.summary);
      setPendingReviews(revRes.data.submissions);
    } catch (err) {
      console.error("Failed to load manager dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenReview = (task) => {
    setSelectedTask(task);
    setReviewForm({
      feedback: "Great work! Clear articulation of requirements and thoughtful approach.",
      rating: 5,
      status: "completed"
    });
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmittingReview(true);
    try {
      await api.patch(`/confidence/assignments/${selectedTask._id}/review`, reviewForm);
      setSelectedTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
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
      {/* Hero Welcome */}
      <div className="hero-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="badge bg-primary bg-opacity-25 text-white px-3 py-1 mb-2">
            <FiUsers className="me-1" /> ENGINEERING TEAM LEAD
          </div>
          <h2 className="fw-bold mb-1">Manager Overview & Mentorship Portal</h2>
          <p className="mb-0 text-white-50">
            Guide your team, review assignment submissions, provide constructive feedback, and oversee project sprints.
          </p>
        </div>
        <Link to="/projects" className="btn btn-light fw-semibold text-primary shadow-sm">
          <FiFolder className="me-1" /> View Team Projects
        </Link>
      </div>

      {/* Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Direct Reports</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.teamCount || 0}</h3>
              <small className="text-primary fw-medium">Active members</small>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <FiUsers />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Active Projects</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.activeProjects || 0}</h3>
              <small className="text-success fw-medium">In sprint delivery</small>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <FiFolder />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Awaiting Review</div>
              <h3 className="fw-bold mb-0 mt-1 text-warning">{pendingReviews.length}</h3>
              <small className="text-muted">Submissions needing grading</small>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <FiClock />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Feedback Rate</div>
              <h3 className="fw-bold mb-0 mt-1 text-info">96%</h3>
              <small className="text-muted">High mentorship cadence</small>
            </div>
            <div className="stat-icon bg-info bg-opacity-10 text-info">
              <FiMessageSquare />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Submissions Section */}
      <div className="content-card mb-4">
        <div className="card-header-custom">
          <div>
            <h6 className="mb-0 fw-bold">Submissions Requiring Review</h6>
            <small className="text-muted">
              Read employee work, evaluate understanding, and provide constructive encouragement
            </small>
          </div>
          <span className="badge bg-warning text-dark px-2 py-1">
            {pendingReviews.length} Pending
          </span>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <FiCheckCircle size={40} className="text-success mb-2" />
            <h6 className="fw-semibold text-dark">All Caught Up!</h6>
            <p className="small mb-0">No recruit submissions are currently pending your feedback.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th className="ps-4">Employee</th>
                  <th>Task Title</th>
                  <th>Department / Day</th>
                  <th>Submitted At</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{item.assignedTo?.name}</div>
                      <small className="text-muted">{item.assignedTo?.designation}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{item.template?.title}</div>
                      <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: 300 }}>
                        {item.submissionText}
                      </small>
                    </td>
                    <td>
                      {item.template?.dayNumber ? (
                        <span className="badge bg-light text-dark border">
                          Day {item.template.dayNumber} (Week {item.template.weekNumber})
                        </span>
                      ) : (
                        <span className="badge bg-info bg-opacity-10 text-info">
                          {item.template?.department}
                        </span>
                      )}
                    </td>
                    <td className="small text-muted">
                      {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="text-end pe-4">
                      <button
                        onClick={() => handleOpenReview(item)}
                        className="btn btn-sm btn-primary d-flex align-items-center gap-1 ms-auto"
                      >
                        <FiCheckCircle size={14} /> Review & Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedTask && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold">Review & Feedback</h5>
                  <small className="text-muted">
                    Submission from {selectedTask.assignedTo?.name} ({selectedTask.assignedTo?.designation})
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>

              <form onSubmit={handleSaveReview}>
                <div className="modal-body p-4">
                  {/* Task Prompt Overview */}
                  <div className="bg-light p-3 rounded-3 mb-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <h6 className="fw-bold text-dark mb-0">{selectedTask.template?.title}</h6>
                      <span className="badge bg-primary">
                        Day {selectedTask.template?.dayNumber || 1}
                      </span>
                    </div>
                    <p className="small text-secondary mb-1">
                      <strong>Prompt:</strong> {selectedTask.template?.description}
                    </p>
                    <p className="small text-muted mb-0">
                      <strong>Instructions:</strong> {selectedTask.template?.instructions}
                    </p>
                  </div>

                  {/* Employee's Submission */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">Employee's Work Submission</label>
                    <div className="p-3 rounded-3 bg-white border border-primary border-opacity-25 shadow-sm small text-dark leading-relaxed whitespace-pre-wrap">
                      {selectedTask.submissionText || "No text submitted."}
                    </div>
                  </div>

                  {/* Feedback Form */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Manager Constructive Feedback & Encouragement
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      required
                    ></textarea>
                    <small className="text-muted">
                      Start with what was done well, then provide a tip for further growth.
                    </small>
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Rating (1 to 5 Stars)</label>
                      <select
                        className="form-select"
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                        }
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Satisfactory)</option>
                        <option value="2">⭐⭐ (2 - Needs Revision)</option>
                      </select>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Final Status</label>
                      <select
                        className="form-select"
                        value={reviewForm.status}
                        onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      >
                        <option value="completed">Mark as Completed</option>
                        <option value="in-progress">Needs Revision (Send back to Recruit)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setSelectedTask(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary fw-semibold"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review & Grade"}
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
