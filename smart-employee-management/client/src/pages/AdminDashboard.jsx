import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers,
  FiLayers,
  FiFolder,
  FiActivity,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiShield
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Employee Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "employee",
    department: "Software Engineering",
    designation: "Junior Software Developer",
    phone: ""
  });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    try {
      const [sumRes, empRes, deptRes] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/employees"),
        api.get("/departments")
      ]);
      setSummary(sumRes.data.summary);
      setEmployees(empRes.data.employees);
      setDepartments(deptRes.data.departments);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/employees/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMsg("");
    try {
      await api.post("/auth/register", newEmp);
      setMsg("Employee account created successfully!");
      setShowAddModal(false);
      setNewEmp({
        name: "",
        email: "",
        password: "password123",
        role: "employee",
        department: "Software Engineering",
        designation: "Junior Software Developer",
        phone: ""
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create employee");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const deptChartData = summary?.departmentStats?.map((d) => ({
    name: d._id || "Other",
    count: d.count
  })) || [];

  const roleChartData = summary?.roleStats?.map((r) => ({
    name: r._id ? r._id.toUpperCase() : "UNKNOWN",
    value: r.count
  })) || [];

  return (
    <div>
      {/* Hero Welcome */}
      <div className="hero-banner d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="badge bg-danger bg-opacity-25 text-danger px-3 py-1 mb-2">
            <FiShield className="me-1" /> SYSTEM ADMINISTRATOR
          </div>
          <h2 className="fw-bold mb-1">Executive Administration Hub</h2>
          <p className="mb-0 text-white-50">
            Monitor organizational metrics, manage accounts, configure departments, and ensure operational readiness.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-light fw-semibold text-primary d-flex align-items-center gap-2 shadow-sm"
        >
          <FiPlus /> Add New Employee
        </button>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Employees</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.totalEmployees || 0}</h3>
              <small className="text-success fw-medium">
                {summary?.activeEmployees || 0} active in organization
              </small>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <FiUsers />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Departments</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.totalDepartments || 0}</h3>
              <small className="text-muted">Active functional units</small>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <FiLayers />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Projects</div>
              <h3 className="fw-bold mb-0 mt-1">{summary?.totalProjects || 0}</h3>
              <small className="text-primary fw-medium">{summary?.activeProjects || 0} in active execution</small>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <FiFolder />
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">System Status</div>
              <h3 className="fw-bold mb-0 mt-1 text-success">Healthy</h3>
              <small className="text-muted">MongoDB + REST API Online</small>
            </div>
            <div className="stat-icon bg-info bg-opacity-10 text-info">
              <FiActivity />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="content-card h-100 p-4">
            <h6 className="fw-bold mb-3 text-dark">Employee Headcount by Department</h6>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={deptChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="content-card h-100 p-4">
            <h6 className="fw-bold mb-3 text-dark">Staff Role Distribution</h6>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex justify-content-center gap-3 flex-wrap small text-muted">
              {roleChartData.map((r, i) => (
                <div key={r.name} className="d-flex align-items-center gap-1">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length] }}
                  ></span>
                  {r.name} ({r.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Management Table */}
      <div className="content-card">
        <div className="card-header-custom">
          <div>
            <h6 className="mb-0 fw-bold">Employee Directory & Account Controls</h6>
            <small className="text-muted">Manage active status, roles, and department assignments</small>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
          >
            <FiPlus /> Register Employee
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Onboarding</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
                        style={{ width: 36, height: 36 }}
                      >
                        {emp.name[0]}
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{emp.name}</div>
                        <div className="small text-muted">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${emp.role}`}>{emp.role}</span>
                  </td>
                  <td>{emp.department}</td>
                  <td className="small text-secondary">{emp.designation}</td>
                  <td>
                    <span
                      className={`badge small ${
                        emp.onboardingStatus === "completed"
                          ? "bg-success"
                          : emp.onboardingStatus === "in-progress"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {emp.onboardingStatus}
                    </span>
                  </td>
                  <td>
                    {emp.isActive ? (
                      <span className="badge bg-success bg-opacity-10 text-success">
                        <FiCheckCircle className="me-1" /> Active
                      </span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger">
                        <FiXCircle className="me-1" /> Deactivated
                      </span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      onClick={() => handleToggleStatus(emp._id)}
                      className={`btn btn-sm ${
                        emp.isActive ? "btn-outline-danger" : "btn-outline-success"
                      }`}
                    >
                      {emp.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Register New Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateEmployee}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEmp.name}
                      onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newEmp.email}
                      onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Role</label>
                      <select
                        className="form-select"
                        value={newEmp.role}
                        onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                      >
                        <option value="employee">Employee / Recruit</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <select
                        className="form-select"
                        value={newEmp.department}
                        onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                      >
                        {departments.map((d) => (
                          <option key={d._id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEmp.designation}
                      onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Temporary Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEmp.password}
                      onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? "Creating..." : "Save Account"}
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
