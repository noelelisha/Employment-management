import React, { useState, useEffect } from "react";
import api from "../services/api";
import { FiLayers, FiPlus, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    manager: "",
    responsibilities: ""
  });

  const fetchData = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get("/departments"),
        api.get("/employees?role=manager")
      ]);
      setDepartments(deptRes.data.departments);
      setManagers(empRes.data.employees);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split("\n").filter((r) => r.trim() !== "")
          : []
      };
      await api.post("/departments", payload);
      setShowModal(false);
      setFormData({ name: "", code: "", description: "", manager: "", responsibilities: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete department");
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
          <h3 className="fw-bold mb-1">Departments & Organization Structure</h3>
          <p className="text-muted small mb-0">
            Define organizational divisions, appointed leadership, and functional mandates.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FiPlus /> New Department
        </button>
      </div>

      <div className="row g-4">
        {departments.map((dept) => (
          <div className="col-md-6 col-xl-4" key={dept._id}>
            <div className="content-card h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                    {dept.code}
                  </span>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="btn btn-sm btn-outline-danger border-0 p-1"
                    title="Delete Department"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <h5 className="fw-bold text-dark">{dept.name}</h5>
                <p className="text-secondary small mb-3">{dept.description}</p>

                <div className="mb-3 small">
                  <span className="text-muted">Lead / Manager: </span>
                  <strong className="text-dark">
                    {dept.manager ? dept.manager.name : "Unassigned"}
                  </strong>
                </div>

                {dept.responsibilities && dept.responsibilities.length > 0 && (
                  <div className="mb-3">
                    <div className="small fw-semibold text-secondary mb-1">Core Responsibilities:</div>
                    <ul className="list-unstyled mb-0 small text-muted">
                      {dept.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx} className="mb-1 d-flex align-items-baseline gap-2">
                          <span className="text-primary">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-top d-flex justify-content-between align-items-center small text-muted">
                <span>
                  <FiUsers className="me-1 text-primary" />
                  <strong>{dept.employeeCount || 0}</strong> Team Members
                </span>
                <span className="badge bg-light text-secondary border">Active Unit</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create New Department</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Quality Assurance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. QA"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Lead Manager</label>
                    <select
                      className="form-select"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    >
                      <option value="">Select a manager (optional)</option>
                      {managers.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name} ({m.department})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Mandate and objectives..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Key Responsibilities (one per line)
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Execute test plans&#10;Automate CI regression suites&#10;Verify defect resolutions"
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Department
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
