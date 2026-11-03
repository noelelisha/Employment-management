import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiCompass,
  FiBookOpen,
  FiCheckSquare,
  FiFolder,
  FiUsers,
  FiAward,
  FiEdit3,
  FiMessageSquare,
  FiInfo,
  FiLogOut,
  FiLayers,
  FiUserCheck,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "hr":
        return "/hr";
      case "manager":
        return "/manager";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="app-wrapper">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
          style={{ zIndex: 999 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? "d-flex position-fixed h-100" : "d-none d-md-flex"}`}>
        <Link to={getDashboardPath()} className="sidebar-brand">
          <div
            className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
          >
            <FiLayers size={20} />
          </div>
          <div>
            <div style={{ fontSize: "1rem", lineHeight: 1.2 }}>SmartWorkplace</div>
            <small style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 400 }}>Learning & Development</small>
          </div>
        </Link>

        <ul className="sidebar-nav">
          <li className="nav-section-title">Core Navigation</li>
          <li>
            <NavLink
              to={getDashboardPath()}
              end
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiHome size={18} /> Dashboard
            </NavLink>
          </li>

          {/* Admin & HR Views */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <>
              <li className="nav-section-title">Administration</li>
              {user?.role === "admin" && (
                <li>
                  <NavLink
                    to="/admin/departments"
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLayers size={18} /> Departments
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/admin/employees"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUsers size={18} /> Employee Directory
                </NavLink>
              </li>
            </>
          )}

          {/* Manager Management Views */}
          {user?.role === "manager" && (
            <>
              <li className="nav-section-title">Team Management</li>
              <li>
                <NavLink
                  to="/manager/reviews"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUserCheck size={18} /> Pending Reviews
                </NavLink>
              </li>
            </>
          )}

          {/* New Recruit & Employee Learning Journey */}
          <li className="nav-section-title">Learning & Growth</li>
          <li>
            <NavLink
              to="/journey"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiCompass size={18} /> 30-Day Journey
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/department-tasks"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiCheckSquare size={18} /> Department Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiBookOpen size={18} /> Workplace Learning
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/journal"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiEdit3 size={18} /> Confidence Journal
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/achievements"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiAward size={18} /> Badges & Honors
            </NavLink>
          </li>

          {/* Work & Collaboration */}
          <li className="nav-section-title">Collaboration</li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiFolder size={18} /> Projects & Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/communication"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiMessageSquare size={18} /> Messages & News
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/onboarding"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiInfo size={18} /> Company Handbook
            </NavLink>
          </li>
        </ul>

        {/* Sidebar Footer */}
        <div className="p-3 border-top border-secondary border-opacity-25">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div
                className="rounded-circle bg-light text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 34, height: 34, fontSize: "0.85rem" }}
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="text-truncate">
                <div className="small fw-semibold text-truncate">{user?.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{user?.designation}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-light border-0 p-1"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="topbar">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-md-none p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-sm-block">
              Smart Employee Management & Workplace Learning
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-md-block">
                <div className="fw-semibold small">{user?.name}</div>
                <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                  {user?.department}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              >
                <FiLogOut size={14} />
                <span className="d-none d-sm-inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
