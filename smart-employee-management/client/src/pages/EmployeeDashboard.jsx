import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiCompass,
  FiCheckCircle,
  FiClock,
  FiBookOpen,
  FiFolder,
  FiAward,
  FiMessageSquare,
  FiArrowRight,
  FiStar,
  FiSend
} from "react-icons/fi";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick submission modal from dashboard
  const [activeTask, setActiveTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/analytics/summary");
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to load employee dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenSubmission = (task) => {
    setActiveTask(task);
    setSubmissionText(task.submissionText || "");
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!activeTask) return;
    setSubmitting(true);
    try {
      await api.patch(`/confidence/assignments/${activeTask._id}/submit`, {
        submissionText,
        status: "submitted"
      });
      setActiveTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit task");
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

  const journeyPercent = summary?.journeyProgress || 0;
  const learningPercent = summary?.learningProgress || 0;

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="hero-banner">
        <div className="badge bg-white bg-opacity-25 text-white px-3 py-1 mb-2">
          <FiCompass className="me-1" /> WELCOME ABOARD
        </div>
        <h2 className="fw-bold mb-1">Hello, {user?.name}!</h2>
        <p className="text-white-50 mb-3" style={{ maxWidth: 680 }}>
          Welcome to your personal development journey at our company. Here is your daily roadmap
          to build confidence, master technical skills, collaborate with teammates, and grow.
        </p>

        {/* 30-Day Journey Progress Bar */}
        <div className="bg-white bg-opacity-10 p-3 rounded-3" style={{ maxWidth: 700 }}>
          <div className="d-flex justify-content-between align-items-center mb-1 text-white small">
            <span className="fw-semibold">30-Day Confidence Journey Overall Progress</span>
            <span className="fw-bold">{journeyPercent}% Completed</span>
          </div>
          <div className="progress progress-thin bg-white bg-opacity-25">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${journeyPercent}%` }}
              aria-valuenow={journeyPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="d-flex justify-content-between mt-2 text-white-50 small">
            <span>{summary?.completedAssignments || 0} completed</span>
            <span>{summary?.submittedAssignments || 0} under review</span>
            <span>{summary?.pendingAssignments || 0} remaining</span>
          </div>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Journey Progress</div>
              <h3 className="fw-bold mb-0 mt-1">{journeyPercent}%</h3>
              <small className="text-success fw-medium">
                {summary?.completedAssignments || 0} of {summary?.totalAssignments || 0} tasks
              </small>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <FiCompass />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Workplace Courses</div>
              <h3 className="fw-bold mb-0 mt-1">{learningPercent}%</h3>
              <small className="text-primary fw-medium">Skills mastery score</small>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <FiBookOpen />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Earned Badges</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.myBadges?.length || 0}</h3>
              <small className="text-warning fw-medium">Achievements unlocked</small>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <FiAward />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Journal Entries</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.journalCount || 0}</h3>
              <small className="text-info fw-medium">Daily reflection logs</small>
            </div>
            <div className="stat-icon bg-info bg-opacity-10 text-info">
              <FiCheckCircle />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Today's Tasks & Projects */}
        <div className="col-lg-7">
          {/* Today's Tasks */}
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <div>
                <h6 className="mb-0 fw-bold">Today's Focus Activities</h6>
                <small className="text-muted">Next steps on your 30-day onboarding journey</small>
              </div>
              <Link to="/journey" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="p-3">
              {summary?.todayTasks?.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FiCheckCircle size={36} className="text-success mb-2" />
                  <p className="mb-0">You have completed all pending tasks for today!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {summary?.todayTasks?.map((item) => (
                    <div key={item._id} className={`day-card ${item.status}`}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {item.template?.dayNumber ? `Day ${item.template.dayNumber}` : item.template?.department}
                        </span>
                        <span className={`badge ${item.status === "submitted" ? "bg-info text-dark" : "bg-warning text-dark"}`}>
                          {item.status}
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{item.template?.title}</h6>
                      <p className="text-secondary small mb-2">{item.template?.description}</p>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <small className="text-muted">
                          Difficulty: <strong className="text-capitalize">{item.template?.difficulty}</strong>
                        </small>
                        <button
                          onClick={() => handleOpenSubmission(item)}
                          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        >
                          <FiSend size={13} /> {item.status === "submitted" ? "Update Work" : "Submit Work"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Projects */}
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="mb-0 fw-bold">Active Projects</h6>
              <Link to="/projects" className="btn btn-sm btn-outline-primary">
                View Project Board
              </Link>
            </div>
            <div className="p-3">
              {summary?.projects?.length === 0 ? (
                <p className="text-muted small mb-0">No active projects assigned yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {summary?.projects?.map((proj) => (
                    <div key={proj._id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0 text-dark">{proj.title}</h6>
                        <span className="badge bg-success">{proj.status}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Deadline: {new Date(proj.deadline).toLocaleDateString()}</span>
                        <span>{proj.progress}% finished</span>
                      </div>
                      <div className="progress progress-thin">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Manager Feedback & Badges */}
        <div className="col-lg-5">
          {/* Manager Feedback */}
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h6 className="mb-0 fw-bold">Manager Mentorship & Feedback</h6>
              <span className="badge bg-primary bg-opacity-10 text-primary">Evaluations</span>
            </div>
            <div className="p-3">
              {summary?.recentFeedbacks?.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <FiClock size={32} className="mb-2 text-secondary" />
                  <p className="mb-0">No manager feedback received yet. Submit your daily tasks to get feedback!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {summary?.recentFeedbacks?.map((fb) => (
                    <div key={fb._id} className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark small">{fb.template?.title}</strong>
                        {fb.rating && (
                          <div className="text-warning small">
                            {[...Array(fb.rating)].map((_, i) => (
                              <FiStar key={i} className="fill-current" style={{ fill: "#f59e0b" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="small text-secondary mb-1 fst-italic">"{fb.feedback}"</p>
                      <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                        Reviewed on {new Date(fb.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="mb-0 fw-bold">Achievement Badges</h6>
              <Link to="/achievements" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="p-3">
              {summary?.myBadges?.length === 0 ? (
                <p className="text-muted small mb-0">Complete tasks and reflections to unlock badges!</p>
              ) : (
                <div className="row g-2">
                  {summary?.myBadges?.map((b) => (
                    <div className="col-6" key={b._id}>
                      <div className="p-2 border rounded-3 text-center bg-white shadow-sm h-100">
                        <div
                          className="d-inline-flex p-2 rounded-circle mb-1 text-white"
                          style={{ backgroundColor: b.color || "#3b82f6" }}
                        >
                          <FiAward size={18} />
                        </div>
                        <div className="fw-bold small text-dark">{b.title}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: "0.68rem" }}>
                          {b.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {activeTask && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Submit Assignment Work</h5>
                <button type="button" className="btn-close" onClick={() => setActiveTask(null)}></button>
              </div>
              <form onSubmit={handleSubmitTask}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <span className="badge bg-primary mb-1">
                      {activeTask.template?.dayNumber ? `Day ${activeTask.template.dayNumber}` : activeTask.template?.department}
                    </span>
                    <h6 className="fw-bold text-dark">{activeTask.template?.title}</h6>
                    <p className="small text-secondary">{activeTask.template?.description}</p>
                    <div className="p-2 bg-light rounded text-muted small">
                      <strong>Instructions:</strong> {activeTask.template?.instructions}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Your Submission / Notes</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Write your response, key observations, elevator pitch, or work summary here..."
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
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
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
