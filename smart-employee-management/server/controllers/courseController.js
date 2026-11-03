import Course from "../models/Course.js";
import TrainingProgress from "../models/TrainingProgress.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 });

    // Fetch progress for current user
    const progresses = await TrainingProgress.find({ employee: req.user._id });
    const progressMap = {};
    progresses.forEach((p) => {
      progressMap[p.course.toString()] = {
        completedLessons: p.completedLessons,
        isCompleted: p.isCompleted,
        completedAt: p.completedAt
      };
    });

    const coursesWithProgress = courses.map((c) => {
      const p = progressMap[c._id.toString()];
      const totalLessons = c.lessons ? c.lessons.length : 0;
      const completedCount = p && p.completedLessons ? p.completedLessons.length : 0;
      const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        ...c.toObject(),
        userProgress: {
          completedLessons: p ? p.completedLessons : [],
          isCompleted: p ? p.isCompleted : false,
          progressPercentage: percent
        }
      };
    });

    res.status(200).json({ success: true, courses: coursesWithProgress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const progress = await TrainingProgress.findOne({
      employee: req.user._id,
      course: course._id
    });

    res.status(200).json({
      success: true,
      course,
      userProgress: progress || { completedLessons: [], isCompleted: false }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIndex } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let progress = await TrainingProgress.findOne({
      employee: req.user._id,
      course: courseId
    });

    if (!progress) {
      progress = new TrainingProgress({
        employee: req.user._id,
        course: courseId,
        completedLessons: []
      });
    }

    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    // Check if all lessons are completed
    if (progress.completedLessons.length >= course.lessons.length) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Lesson marked complete",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
