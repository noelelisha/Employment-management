import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers,
  FiUserPlus,
  FiCompass,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiSend
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ONBOARD_COLORS = ["#10b981", "#2563eb", "#94a3b8"];

export default function HRDashboard() {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  const fetchData = async () => {
    try {
      const [sumRes, empRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/employees")
      ]);
      setSummary(sumRes.data.summary);
      setEmployees(empRes.data.employees);
    } catch (err) {
      console.error("Failed to load HR dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignJourney = async (empId, name) => {
    setAssigningId(empId);
    setActionMsg("");
    try {
      const res = await api.post(`/confidence/assign/${empId}`);
      setActionMsg(`Success: ${res.data.message || `Assigned journey to ${name}`}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign 30-day journey");
    } finally {
      setAssigningId(null);
    }
  };

  const handleMarkCompleted = async (empId) => {
    try {
      await api.put(`/employees/${empId}`, { onboardingStatus: "completed" });
      setActionMsg("Employee onboarding successfully marked as Completed!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update onboarding status");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const recruits = employees.filter((e) => e.role === "employee");

  return (
    <div>
      {/* Hero Welcome */}
      <div className="hero-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="badge bg-success bg-opacity-25 text-success px-3 py-1 mb-2">
            <FiUsers className="me-1" /> HUMAN RESOURCES PORTAL
          </div>
          <h2 className="fw-bold mb-1">Talent Onboarding & People Operations</h2>
          <p className="mb-0 text-white-50">
            Guide new recruits through their 30-day orientation, track workplace readiness, and celebrate milestones.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <FiCheckCircle className="me-2" />
          {actionMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionMsg("")}
          ></button>
        </div>
      )}

      {/* Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Recruits</div>
              <h3 className="fw-bold mb-0 mt-1">{recruits.length}</h3>
              <small className="text-primary fw-medium">Active new hires</small>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <FiUserPlus />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">In Progress</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.inProgressOnboarding || 0}</h3>
              <small className="text-info fw-medium">Active in 30-Day Journey</small>
            </div>
            <div className="stat-icon bg-info bg-opacity-10 text-info">
              <FiCompass />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Completed</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.completedOnboarding || 0}</h3>
              <small className="text-success fw-medium">Successfully graduated</small>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <FiCheckCircle />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Pending Submissions</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.pendingSubmissions || 0}</h3>
              <small className="text-warning fw-medium">Awaiting evaluation</small>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <FiClock />
            </div>
          </div>
        </div>
      </div>

      {/* Recruits Monitoring Table */}
      <div className="content-card mb-4">
        <div className="card-header-custom">
          <div>
            <h6 className="mb-0 fw-bold">New Recruit Onboarding Pipeline</h6>
            <small className="text-muted">
              Assign structured 30-day confidence journeys, review progress, and sign off completion
            </small>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Recruit</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Onboarding Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recruits.map((rec) => (
                <tr key={rec._id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
                        style={{ width: 36, height: 36 }}
                      >
                        {rec.name[0]}
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{rec.name}</div>
                        <div className="small text-muted">{rec.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{rec.department}</td>
                  <td className="small text-secondary">{rec.designation}</td>
                  <td className="small text-muted">
                    {new Date(rec.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        rec.onboardingStatus === "completed"
                          ? "bg-success"
                          : rec.onboardingStatus === "in-progress"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {rec.onboardingStatus}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() => handleAssignJourney(rec._id, rec.name)}
                        disabled={assigningId === rec._id}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                      >
                        <FiCompass size={14} />
                        {assigningId === rec._id ? "Assigning..." : "Assign 30-Day Journey"}
                      </button>

                      {rec.onboardingStatus !== "completed" && (
                        <button
                          onClick={() => handleMarkCompleted(rec._id)}
                          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                        >
                          <FiCheckCircle size={14} /> Mark Graduated
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
