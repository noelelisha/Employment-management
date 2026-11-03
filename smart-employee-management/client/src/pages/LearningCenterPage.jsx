import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiAward
} from "react-icons/fi";

export default function LearningCenterPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson Viewer Modal
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completing, setCompleting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCourse = (course) => {
    setActiveCourse(course);
    setActiveLessonIndex(0);
  };

  const handleCompleteLesson = async (courseId, lessonIdx) => {
    setCompleting(true);
    try {
      await api.post(`/courses/${courseId}/complete-lesson`, {
        lessonIndex: lessonIdx
      });
      fetchCourses();
      // Move to next lesson if available
      if (activeCourse && lessonIdx + 1 < activeCourse.lessons.length) {
        setActiveLessonIndex(lessonIdx + 1);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark lesson complete");
    } finally {
      setCompleting(false);
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
          <FiBookOpen className="me-1" /> PROFESSIONAL GROWTH ACADEMY
        </div>
        <h2 className="fw-bold mb-2">Workplace Learning & Skills Modules</h2>
        <p className="text-white-50 mb-0" style={{ maxWidth: 720 }}>
          Essential career competencies designed for new recruits: communication mastery, teamwork,
          time management, problem-solving, project fundamentals, and presentation excellence.
        </p>
      </div>

      <div className="row g-4">
        {courses.map((course) => {
          const progress = course.userProgress?.progressPercentage || 0;
          const isDone = course.userProgress?.isCompleted;

          return (
            <div className="col-md-6 col-xl-3" key={course._id}>
              <div className="content-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {course.category}
                    </span>
                    <span className="small text-muted d-flex align-items-center gap-1">
                      <FiClock size={12} /> {course.duration}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{course.title}</h5>
                  <p className="text-secondary small mb-3">{course.description}</p>
                </div>

                <div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Progress</span>
                      <strong className={isDone ? "text-success" : "text-primary"}>
                        {progress}%
                      </strong>
                    </div>
                    <div className="progress progress-thin">
                      <div
                        className={`progress-bar ${isDone ? "bg-success" : "bg-primary"}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCourse(course)}
                    className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
                      isDone ? "btn-outline-success" : "btn-primary"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <FiCheckCircle /> Completed (Review)
                      </>
                    ) : (
                      <>
                        <FiPlay /> Start Learning
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Lesson Modal */}
      {activeCourse && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <span className="badge bg-primary mb-1">{activeCourse.category}</span>
                  <h5 className="modal-title fw-bold">{activeCourse.title}</h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveCourse(null)}></button>
              </div>

              <div className="modal-body p-4">
                {/* Lesson Navigation tabs */}
                <div className="d-flex gap-2 mb-4 overflow-auto pb-2 border-bottom">
                  {activeCourse.lessons.map((lesson, idx) => {
                    const isLessonDone = activeCourse.userProgress?.completedLessons?.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`btn btn-sm text-nowrap ${
                          activeLessonIndex === idx
                            ? "btn-primary"
                            : isLessonDone
                            ? "btn-light text-success border-success"
                            : "btn-light"
                        }`}
                      >
                        {isLessonDone && <FiCheckCircle className="me-1" />}
                        Lesson {idx + 1}: {lesson.title}
                      </button>
                    );
                  })}
                </div>

                {/* Lesson Content */}
                {activeCourse.lessons[activeLessonIndex] && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">
                      {activeCourse.lessons[activeLessonIndex].title}
                    </h5>

                    <div className="p-3 bg-light rounded-3 mb-3 leading-relaxed text-secondary">
                      {activeCourse.lessons[activeLessonIndex].content}
                    </div>

                    <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 mb-3">
                      <strong className="text-primary d-block mb-1">
                        <FiAward className="me-1" /> Key Actionable Takeaway:
                      </strong>
                      <span className="text-dark small">
                        {activeCourse.lessons[activeLessonIndex].keyTakeaway}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <small className="text-muted">
                        Lesson {activeLessonIndex + 1} of {activeCourse.lessons.length}
                      </small>

                      <button
                        onClick={() =>
                          handleCompleteLesson(activeCourse._id, activeLessonIndex)
                        }
                        className="btn btn-success d-flex align-items-center gap-2"
                        disabled={completing}
                      >
                        <FiCheckCircle /> Mark Lesson Completed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
