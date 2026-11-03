import React from "react";
import {
  FiBookOpen,
  FiCompass,
  FiTarget,
  FiShield,
  FiUsers,
  FiMessageSquare,
  FiCheckCircle,
  FiAward
} from "react-icons/fi";

export default function CompanyOnboardingPage() {
  return (
    <div>
      <div className="hero-banner mb-4">
        <div className="badge bg-white bg-opacity-25 text-white px-3 py-1 mb-2">
          <FiBookOpen className="me-1" /> WELCOME TO OUR ORGANIZATION
        </div>
        <h2 className="fw-bold mb-2">Company Onboarding Hub & Handbook</h2>
        <p className="mb-0 text-white-50" style={{ maxWidth: 720 }}>
          Everything you need to know about our history, purpose, core values, code of conduct,
          communication guidelines, and organizational expectations.
        </p>
      </div>

      <div className="row g-4">
        {/* Company Vision, Mission & Values */}
        <div className="col-lg-6">
          <div className="content-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <FiTarget size={24} />
              <h5 className="fw-bold mb-0 text-dark">Vision, Mission & Purpose</h5>
            </div>
            <p className="text-secondary small leading-relaxed">
              Founded with the belief that technology and empathetic leadership empower people to solve
              humanity's most pressing challenges, our company designs intuitive digital solutions for
              millions of global users.
            </p>
            <div className="bg-light p-3 rounded-3 mb-3 border">
              <h6 className="fw-bold text-dark mb-1">Our Mission:</h6>
              <p className="small text-secondary mb-0">
                To build dependable, human-centric software while nurturing an empowering environment
                where emerging talent learns, collaborates, and thrives.
              </p>
            </div>

            <h6 className="fw-bold text-dark mt-4 mb-2">Core Company Values:</h6>
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex gap-2">
                <span className="badge bg-primary">1</span>
                <div>
                  <strong>Excellence with Empathy:</strong> We deliver robust quality while caring
                  deeply about our teammates and clients.
                </div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-success">2</span>
                <div>
                  <strong>Continuous Learning:</strong> Mistakes are learning opportunities. Curiosity
                  and steady growth are celebrated daily.
                </div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-warning text-dark">3</span>
                <div>
                  <strong>Radical Transparency:</strong> Open feedback, clear roadmaps, and honest
                  communication build lasting organizational trust.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workplace Policies & Rules */}
        <div className="col-lg-6">
          <div className="content-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3 text-success">
              <FiShield size={24} />
              <h5 className="fw-bold mb-0 text-dark">Workplace Policies & Conduct</h5>
            </div>
            <p className="text-secondary small">
              Our workplace policies are designed to protect every employee's dignity, safety, and
              mental well-being.
            </p>

            <div className="accordion" id="policyAccordion">
              <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed py-2 px-3 fw-semibold small"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#c1"
                  >
                    1. Anti-Harassment & Inclusive Culture
                  </button>
                </h2>
                <div id="c1" className="accordion-collapse collapse show">
                  <div className="accordion-body small text-secondary">
                    We maintain zero tolerance for discrimination, harassment, or disrespectful behavior
                    based on gender, race, religion, or background. Everyone belongs here.
                  </div>
                </div>
              </div>

              <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed py-2 px-3 fw-semibold small"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#c2"
                  >
                    2. Flexible Hours & Deep Work Policy
                  </button>
                </h2>
                <div id="c2" className="accordion-collapse collapse">
                  <div className="accordion-body small text-secondary">
                    Core collaboration hours are 10:00 AM to 4:00 PM. Outside core hours, we promote
                    asynchronous focus time with no expectation of immediate replies.
                  </div>
                </div>
              </div>

              <div className="accordion-item border rounded-3 mb-2 overflow-hidden">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed py-2 px-3 fw-semibold small"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#c3"
                  >
                    3. Data Security & Confidentiality
                  </button>
                </h2>
                <div id="c3" className="accordion-collapse collapse">
                  <div className="accordion-body small text-secondary">
                    Always use company-provided password managers, never share production database
                    credentials in unencrypted chats, and enable two-factor authentication on all tools.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Guidelines */}
        <div className="col-lg-6">
          <div className="content-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3 text-info">
              <FiMessageSquare size={24} />
              <h5 className="fw-bold mb-0 text-dark">Communication & Feedback Guidelines</h5>
            </div>
            <p className="text-secondary small">
              Effective communication prevents confusion, elevates productivity, and creates strong bonds.
            </p>

            <div className="d-flex flex-column gap-3 small">
              <div className="p-3 bg-light rounded-3 border-start border-4 border-info">
                <strong>Bottom Line Up Front (BLUF):</strong>
                <p className="mb-0 text-secondary mt-1">
                  When sending emails or messages to teammates, state the primary question or action
                  requested in the very first sentence, followed by context.
                </p>
              </div>

              <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                <strong>Constructive Feedback Sandwich:</strong>
                <p className="mb-0 text-secondary mt-1">
                  Start with genuine appreciation for effort, offer specific and actionable suggestions for
                  improvement, and end with encouraging confidence in their ability to succeed.
                </p>
              </div>

              <div className="p-3 bg-light rounded-3 border-start border-4 border-success">
                <strong>Raising Blockers Early:</strong>
                <p className="mb-0 text-secondary mt-1">
                  If you are blocked for more than 45 minutes on any task, reach out to your mentor, manager,
                  or teammate. Asking for help is a sign of high competence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="col-lg-6">
          <div className="content-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3 text-warning">
              <FiUsers size={24} />
              <h5 className="fw-bold mb-0 text-dark">Departments & Organizational Structure</h5>
            </div>
            <p className="text-secondary small">
              Cross-functional harmony powers our projects. Here is how our teams collaborate:
            </p>

            <ul className="list-group list-group-flush small">
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">Software Engineering</strong>
                  <div className="text-muted">Builds web applications, APIs, databases, and microservices.</div>
                </div>
                <span className="badge bg-primary">Build & Ship</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">UI/UX Design</strong>
                  <div className="text-muted">Researches user pain points, crafts wireframes, and ensures visual elegance.</div>
                </div>
                <span className="badge bg-secondary">Design & Polish</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">Business Analysis</strong>
                  <div className="text-muted">Transforms customer goals into clear project requirements and user stories.</div>
                </div>
                <span className="badge bg-info text-dark">Scope & Align</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">Marketing</strong>
                  <div className="text-muted">Engages customers, drives product visibility, and builds brand loyalty.</div>
                </div>
                <span className="badge bg-warning text-dark">Growth & Reach</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                <div>
                  <strong className="text-dark">People & Culture (HR)</strong>
                  <div className="text-muted">Fosters career growth, onboarding, wellness, and team happiness.</div>
                </div>
                <span className="badge bg-success">Talent & Culture</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
