import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiPlus
} from "react-icons/fi";

export default function EmployeeDirectoryPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get("/employees"),
        api.get("/departments")
      ]);
      setEmployees(empRes.data.employees);
      setDepartments(deptRes.data.departments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept ? emp.department === selectedDept : true;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Company Staff Directory</h3>
          <p className="text-muted small mb-0">
            Comprehensive registry of active personnel, department managers, and recruit cohorts.
          </p>
        </div>

        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0">
              <FiSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: "auto" }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map((emp) => (
          <div className="col-md-6 col-xl-4" key={emp._id}>
            <div className="content-card h-100 p-4">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: 44, height: 44, fontSize: "1.1rem" }}
                  >
                    {emp.name[0]}
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{emp.name}</h6>
                    <small className="text-muted">{emp.designation}</small>
                  </div>
                </div>
                <span className={`role-badge ${emp.role}`}>{emp.role}</span>
              </div>

              <div className="mb-3 small">
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Department</span>
                  <span className="fw-semibold text-dark">{emp.department}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Email</span>
                  <span className="text-primary">{emp.email}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Phone</span>
                  <span>{emp.phone || "Not listed"}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Status</span>
                  <span>
                    {emp.isActive ? (
                      <span className="text-success fw-medium">
                        <FiCheckCircle className="me-1" /> Active
                      </span>
                    ) : (
                      <span className="text-danger fw-medium">
                        <FiXCircle className="me-1" /> Inactive
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {emp.bio && (
                <div className="p-2 bg-light rounded small text-secondary fst-italic">
                  "{emp.bio}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
