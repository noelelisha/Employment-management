import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiCheckCircle,
  FiClock,
  FiUser,
  FiStar,
  FiMessageSquare
} from "react-icons/fi";

export default function PendingReviewsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [reviewForm, setReviewForm] = useState({ feedback: "", rating: 5, status: "completed" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/confidence/reviews/pending");
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
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
      fetchSubmissions();
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Pending Recruit Submissions</h3>
          <p className="text-muted small mb-0">
            Review assignment submissions, assess performance, and give constructive feedback.
          </p>
        </div>
        <span className="badge bg-warning text-dark px-3 py-2">
          {submissions.length} Submissions Awaiting Review
        </span>
      </div>

      <div className="content-card">
        {submissions.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <FiCheckCircle size={44} className="text-success mb-2" />
            <h5 className="fw-bold text-dark">All Submissions Reviewed!</h5>
            <p className="small mb-0">There are no pending submissions waiting for your feedback right now.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th className="ps-4">Recruit</th>
                  <th>Task Title</th>
                  <th>Department / Day</th>
                  <th>Submitted At</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{item.assignedTo?.name}</div>
                      <small className="text-muted">{item.assignedTo?.designation}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{item.template?.title}</div>
                      <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: 320 }}>
                        {item.submissionText}
                      </small>
                    </td>
                    <td>
                      {item.template?.dayNumber ? (
                        <span className="badge bg-light text-dark border">
                          Day {item.template.dayNumber}
                        </span>
                      ) : (
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {item.template?.department}
                        </span>
                      )}
                    </td>
                    <td className="small text-muted">
                      {new Date(item.updatedAt).toLocaleDateString()}
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

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">Employee's Work Submission</label>
                    <div className="p-3 rounded-3 bg-white border border-primary border-opacity-25 shadow-sm small text-dark leading-relaxed">
                      {selectedTask.submissionText || "No text submitted."}
                    </div>
                  </div>

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
                  </div>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Rating</label>
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
                        <option value="in-progress">Needs Revision (Send back)</option>
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
