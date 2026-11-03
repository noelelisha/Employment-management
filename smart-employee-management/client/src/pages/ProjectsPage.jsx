import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiFolder,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiSend,
  FiUser,
  FiList
} from "react-icons/fi";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for new project
  const [showProjModal, setShowProjModal] = useState(false);
  const [projForm, setProjForm] = useState({
    title: "",
    description: "",
    department: user?.department || "Software Engineering",
    deadline: ""
  });

  // Modal for new task
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    projectId: "",
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium"
  });

  // Modal for task submission
  const [activeTask, setActiveTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, taskRes, empRes] = await Promise.all([
        api.get("/projects"),
        api.get("/projects/tasks"),
        user.role !== "employee" ? api.get("/employees") : Promise.resolve({ data: { employees: [] } })
      ]);
      setProjects(projRes.data.projects);
      setTasks(taskRes.data.tasks);
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", projForm);
      setShowProjModal(false);
      setProjForm({
        title: "",
        description: "",
        department: user?.department || "Software Engineering",
        deadline: ""
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects/tasks", taskForm);
      setShowTaskModal(false);
      setTaskForm({
        projectId: "",
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "medium"
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign project task");
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!activeTask) return;
    setSubmitting(true);
    try {
      await api.patch(`/projects/tasks/${activeTask._id}/submit`, {
        submissionText
      });
      setActiveTask(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit project task");
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

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Project Management & Deliverables</h3>
          <p className="text-muted small mb-0">
            Collaborate on sprint deliverables, submit milestones, and monitor deadlines.
          </p>
        </div>

        {(user.role === "admin" || user.role === "manager") && (
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                if (projects.length > 0) {
                  setTaskForm({ ...taskForm, projectId: projects[0]._id });
                }
                setShowTaskModal(true);
              }}
              className="btn btn-outline-primary d-flex align-items-center gap-1"
            >
              <FiList /> Assign Task
            </button>
            <button
              onClick={() => setShowProjModal(true)}
              className="btn btn-primary d-flex align-items-center gap-1"
            >
              <FiPlus /> New Project
            </button>
          </div>
        )}
      </div>

      {/* Projects List */}
      <h5 className="fw-bold text-dark mb-3">Active Projects</h5>
      <div className="row g-4 mb-5">
        {projects.length === 0 ? (
          <div className="col-12 text-muted">No projects available.</div>
        ) : (
          projects.map((proj) => (
            <div className="col-lg-6" key={proj._id}>
              <div className="content-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {proj.department}
                    </span>
                    <span
                      className={`badge small ${
                        proj.status === "completed"
                          ? "bg-success"
                          : proj.status === "in-progress"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{proj.title}</h5>
                  <p className="text-secondary small mb-3">{proj.description}</p>

                  <div className="d-flex flex-wrap justify-content-between small text-muted mb-2">
                    <span>
                      Manager: <strong>{proj.manager?.name || "Unassigned"}</strong>
                    </span>
                    <span>
                      Deadline: <strong>{new Date(proj.deadline).toLocaleDateString()}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-top">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Sprint Execution</span>
                    <strong>{proj.progress}%</strong>
                  </div>
                  <div className="progress progress-thin">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Project Tasks Table */}
      <div className="content-card">
        <div className="card-header-custom">
          <div>
            <h6 className="mb-0 fw-bold">Project Task Assignments</h6>
            <small className="text-muted">
              {user.role === "employee" ? "Tasks assigned to you" : "All team tasks in projects"}
            </small>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="p-4 text-center text-muted small">No tasks assigned.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th className="ps-4">Task Details</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{task.title}</div>
                      <small className="text-muted">{task.description}</small>
                    </td>
                    <td className="small text-secondary">{task.project?.title || "N/A"}</td>
                    <td className="small text-dark fw-medium">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>
                    <td className="small text-muted">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge small ${
                          task.status === "completed"
                            ? "bg-success"
                            : task.status === "submitted"
                            ? "bg-info text-dark"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {task.assignedTo?._id === user._id && task.status !== "completed" && (
                        <button
                          onClick={() => {
                            setActiveTask(task);
                            setSubmissionText(task.submissionText || "");
                          }}
                          className="btn btn-sm btn-primary d-flex align-items-center gap-1 ms-auto"
                        >
                          <FiSend size={13} /> {task.status === "submitted" ? "Update" : "Submit"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showProjModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create New Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowProjModal(false)}></button>
              </div>
              <form onSubmit={handleCreateProject}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Project Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={projForm.description}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      value={projForm.deadline}
                      onChange={(e) => setProjForm({ ...projForm, deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowProjModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Assign Project Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Project</label>
                    <select
                      className="form-select"
                      value={taskForm.projectId}
                      onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                      required
                    >
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Assign To Employee</label>
                    <select
                      className="form-select"
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowTaskModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Submission Modal */}
      {activeTask && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Submit Task: {activeTask.title}</h5>
                <button type="button" className="btn-close" onClick={() => setActiveTask(null)}></button>
              </div>
              <form onSubmit={handleSubmitTask}>
                <div className="modal-body p-4">
                  <p className="small text-secondary mb-3">{activeTask.description}</p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Work Submission</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe what you built or paste your commit / pull request details..."
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
