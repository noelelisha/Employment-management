import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiAward,
  FiStar,
  FiCheckCircle,
  FiUsers,
  FiGift
} from "react-icons/fi";

export default function BadgesPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Award Modal (Manager/HR/Admin)
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [targetEmployee, setTargetEmployee] = useState("");
  const [awardNote, setAwardNote] = useState("");
  const [awarding, setAwarding] = useState(false);

  const fetchData = async () => {
    try {
      const [achRes, empRes] = await Promise.all([
        api.get("/achievements"),
        user.role !== "employee" ? api.get("/employees?role=employee") : Promise.resolve({ data: { employees: [] } })
      ]);
      setAchievements(achRes.data.achievements);
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleOpenAward = (badge) => {
    setSelectedBadge(badge);
    setTargetEmployee(employees[0]?._id || "");
    setAwardNote("Outstanding performance and positive collaboration!");
    setShowAwardModal(true);
  };

  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBadge || !targetEmployee) return;
    setAwarding(true);
    try {
      await api.post(`/achievements/${selectedBadge._id}/award`, {
        employeeId: targetEmployee,
        note: awardNote
      });
      setShowAwardModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to award badge");
    } finally {
      setAwarding(false);
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
      <div className="hero-banner mb-4">
        <div className="badge bg-white bg-opacity-25 text-white px-3 py-1 mb-2">
          <FiAward className="me-1" /> RECOGNITION & HONORS
        </div>
        <h2 className="fw-bold mb-2">Achievement Badges & Growth Milestones</h2>
        <p className="text-white-50 mb-0" style={{ maxWidth: 720 }}>
          Celebrate technical mastery, clear communication, proactive collaboration, and problem-solving.
          Badges recognize recruit growth and workplace confidence.
        </p>
      </div>

      <div className="row g-4">
        {achievements.map((badge) => {
          const isEarnedByMe = badge.earnedByMe;

          return (
            <div className="col-md-6 col-xl-4" key={badge._id}>
              <div
                className={`content-card h-100 p-4 d-flex flex-column justify-content-between position-relative ${
                  isEarnedByMe ? "border-primary shadow-sm" : ""
                }`}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: 54,
                        height: 54,
                        backgroundColor: badge.color || "#3b82f6",
                        opacity: isEarnedByMe || user.role !== "employee" ? 1 : 0.4
                      }}
                    >
                      <FiAward size={26} />
                    </div>

                    {isEarnedByMe && (
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                        <FiCheckCircle className="me-1" /> Unlocked by You
                      </span>
                    )}
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{badge.title}</h5>
                  <p className="text-secondary small mb-3">{badge.description}</p>

                  {isEarnedByMe && badge.myAwardNote && (
                    <div className="p-2.5 bg-light rounded-3 small mb-3 border-start border-3 border-success">
                      <strong className="text-success small d-block">Award Note:</strong>
                      <span className="text-muted fst-italic">"{badge.myAwardNote}"</span>
                    </div>
                  )}

                  {/* Recipient list */}
                  <div className="small text-muted mb-2">
                    <FiUsers className="me-1" /> Awarded to {badge.recipients?.length || 0} employees
                  </div>
                </div>

                <div className="pt-3 border-top mt-2">
                  {user.role !== "employee" ? (
                    <button
                      onClick={() => handleOpenAward(badge)}
                      className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1"
                    >
                      <FiGift /> Award Badge to Employee
                    </button>
                  ) : isEarnedByMe ? (
                    <div className="text-success small fw-semibold text-center">
                      ⭐ Displayed on your Profile
                    </div>
                  ) : (
                    <div className="text-muted small text-center">
                      Locked • Keep progressing in your 30-Day Journey to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Award Badge Modal */}
      {showAwardModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Award Badge: {selectedBadge?.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAwardModal(false)}></button>
              </div>

              <form onSubmit={handleAwardSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Employee / Recruit</label>
                    <select
                      className="form-select"
                      value={targetEmployee}
                      onChange={(e) => setTargetEmployee(e.target.value)}
                      required
                    >
                      {employees.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e.name} ({e.department} - {e.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Personalized Award Citation / Note</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={awardNote}
                      onChange={(e) => setAwardNote(e.target.value)}
                      placeholder="e.g. Demonstrated exceptional teamwork and proactive support during sprint delivery..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowAwardModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={awarding}>
                    {awarding ? "Awarding..." : "Confirm & Award Badge"}
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
