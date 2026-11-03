import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiMessageSquare,
  FiSend,
  FiBell,
  FiUser,
  FiUsers,
  FiPlus
} from "react-icons/fi";

export default function CommunicationPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // New announcement modal
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState({
    title: "",
    content: "",
    priority: "general",
    department: "All"
  });

  const fetchData = async () => {
    try {
      const [membersRes, annRes] = await Promise.all([
        api.get("/employees/team"),
        api.get("/communication/announcements")
      ]);
      const otherMembers = membersRes.data.members.filter((m) => m._id !== user._id);
      setTeamMembers(otherMembers);
      setAnnouncements(annRes.data.announcements);
      if (otherMembers.length > 0 && !selectedUser) {
        setSelectedUser(otherMembers[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      api
        .get(`/communication/messages/${selectedUser._id}`)
        .then((res) => setMessages(res.data.messages))
        .catch(console.error);
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedUser) return;
    try {
      const res = await api.post("/communication/messages", {
        recipientId: selectedUser._id,
        content: msgInput
      });
      setMessages([...messages, res.data.message]);
      setMsgInput("");
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post("/communication/announcements", announceForm);
      setShowAnnounceModal(false);
      setAnnounceForm({ title: "", content: "", priority: "general", department: "All" });
      fetchData();
    } catch (err) {
      alert("Failed to post announcement");
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
          <h3 className="fw-bold mb-1">Workplace Communication & Announcements</h3>
          <p className="text-muted small mb-0">
            Real-time internal chat, team messaging, and broadcast company news.
          </p>
        </div>

        {(user.role === "admin" || user.role === "hr" || user.role === "manager") && (
          <button
            onClick={() => setShowAnnounceModal(true)}
            className="btn btn-primary d-flex align-items-center gap-1"
          >
            <FiPlus /> Post Announcement
          </button>
        )}
      </div>

      <div className="row g-4">
        {/* Left: Direct Messaging */}
        <div className="col-lg-7">
          <div className="content-card h-100 d-flex flex-column" style={{ minHeight: 520 }}>
            <div className="card-header-custom">
              <div className="d-flex align-items-center gap-2">
                <FiMessageSquare className="text-primary" />
                <h6 className="mb-0 fw-bold">Internal Messenger</h6>
              </div>
              {selectedUser && (
                <span className="small text-muted">
                  Chatting with <strong>{selectedUser.name}</strong> ({selectedUser.designation})
                </span>
              )}
            </div>

            <div className="row g-0 flex-grow-1">
              {/* Teammate list */}
              <div className="col-4 border-end" style={{ maxHeight: 440, overflowY: "auto" }}>
                <div className="list-group list-group-flush">
                  {teamMembers.map((m) => (
                    <button
                      key={m._id}
                      onClick={() => setSelectedUser(m)}
                      className={`list-group-item list-group-item-action border-0 py-3 text-start ${
                        selectedUser?._id === m._id ? "bg-light fw-bold" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 text-primary small fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32 }}
                        >
                          {m.name[0]}
                        </div>
                        <div className="text-truncate">
                          <div className="small text-dark text-truncate">{m.name}</div>
                          <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                            {m.department}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="col-8 d-flex flex-column justify-content-between p-3" style={{ height: 440 }}>
                <div className="flex-grow-1 overflow-auto d-flex flex-column gap-2 mb-3 pe-1">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted my-auto small">
                      No message history with {selectedUser?.name}. Say hello!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                      return (
                        <div
                          key={msg._id}
                          className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}
                        >
                          <div
                            className={`p-2.5 rounded-3 small ${
                              isMe ? "bg-primary text-white" : "bg-light text-dark border"
                            }`}
                            style={{ maxWidth: "80%" }}
                          >
                            {msg.content}
                          </div>
                          <span className="text-muted mt-1" style={{ fontSize: "0.65rem" }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder={`Message ${selectedUser?.name || "colleague"}...`}
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-sm btn-primary">
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Announcements */}
        <div className="col-lg-5">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <div className="d-flex align-items-center gap-2">
                <FiBell className="text-warning" />
                <h6 className="mb-0 fw-bold">Company Announcements</h6>
              </div>
              <span className="badge bg-light text-dark border">{announcements.length} updates</span>
            </div>

            <div className="p-3 d-flex flex-column gap-3" style={{ maxHeight: 460, overflowY: "auto" }}>
              {announcements.length === 0 ? (
                <div className="text-center text-muted py-4 small">No announcements posted.</div>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann._id}
                    className={`p-3 rounded-3 border-start border-4 ${
                      ann.priority === "urgent"
                        ? "border-danger bg-danger bg-opacity-10"
                        : ann.priority === "important"
                        ? "border-warning bg-warning bg-opacity-10"
                        : "border-primary bg-light"
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold mb-0 text-dark small">{ann.title}</h6>
                      <span className="badge bg-light text-muted border text-capitalize" style={{ fontSize: "0.68rem" }}>
                        {ann.priority}
                      </span>
                    </div>
                    <p className="small text-secondary mb-2">{ann.content}</p>
                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.72rem" }}>
                      <span>Posted by {ann.author?.name || "Management"}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Announcement Modal */}
      {showAnnounceModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Post Company Announcement</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnnounceModal(false)}></button>
              </div>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={announceForm.title}
                      onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Priority</label>
                    <select
                      className="form-select"
                      value={announceForm.priority}
                      onChange={(e) => setAnnounceForm({ ...announceForm, priority: e.target.value })}
                    >
                      <option value="general">General Update</option>
                      <option value="important">Important Notice</option>
                      <option value="urgent">Urgent Announcement</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Content</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={announceForm.content}
                      onChange={(e) => setAnnounceForm({ ...announceForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowAnnounceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Publish Announcement
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
