import User from "../models/User.js";
import Department from "../models/Department.js";
import Project from "../models/Project.js";
import ProjectTask from "../models/ProjectTask.js";
import EmployeeTaskAssignment from "../models/EmployeeTaskAssignment.js";
import Course from "../models/Course.js";
import TrainingProgress from "../models/TrainingProgress.js";
import JournalEntry from "../models/JournalEntry.js";
import Achievement from "../models/Achievement.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "admin") {
      const totalEmployees = await User.countDocuments();
      const activeEmployees = await User.countDocuments({ isActive: true });
      const totalDepartments = await Department.countDocuments();
      const totalProjects = await Project.countDocuments();
      const activeProjects = await Project.countDocuments({ status: "in-progress" });

      // Breakdown by department
      const departmentStats = await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$department", count: { $sum: 1 } } }
      ]);

      // Role breakdown
      const roleStats = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]);

      return res.status(200).json({
        success: true,
        summary: {
          totalEmployees,
          activeEmployees,
          totalDepartments,
          totalProjects,
          activeProjects,
          departmentStats,
          roleStats
        }
      });
    }

    if (user.role === "hr") {
      const totalEmployees = await User.countDocuments();
      const newRecruits = await User.countDocuments({ role: "employee" });
      const completedOnboarding = await User.countDocuments({ onboardingStatus: "completed" });
      const inProgressOnboarding = await User.countDocuments({ onboardingStatus: "in-progress" });
      const pendingSubmissions = await EmployeeTaskAssignment.countDocuments({ status: "submitted" });

      const onboardingStats = [
        { name: "Completed", value: completedOnboarding },
        { name: "In Progress", value: inProgressOnboarding },
        { name: "Not Started", value: totalEmployees - completedOnboarding - inProgressOnboarding }
      ];

      return res.status(200).json({
        success: true,
        summary: {
          totalEmployees,
          newRecruits,
          completedOnboarding,
          inProgressOnboarding,
          pendingSubmissions,
          onboardingStats
        }
      });
    }

    if (user.role === "manager") {
      const departmentEmployees = await User.find({ department: user.department, isActive: true }).select("name email designation");
      const teamCount = departmentEmployees.length;

      const myProjects = await Project.find({
        $or: [{ manager: user._id }, { department: user.department }]
      });
      const activeProjects = myProjects.filter((p) => p.status === "in-progress").length;

      const pendingReviews = await EmployeeTaskAssignment.countDocuments({ status: "submitted" });
      const pendingProjectTasks = await ProjectTask.countDocuments({ status: "submitted" });

      return res.status(200).json({
        success: true,
        summary: {
          teamCount,
          activeProjects,
          pendingReviews: pendingReviews + pendingProjectTasks,
          projects: myProjects,
          teamMembers: departmentEmployees
        }
      });
    }

    // Default: Employee / New Recruit
    const assignments = await EmployeeTaskAssignment.find({ assignedTo: user._id }).populate("template");
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter((a) => a.status === "completed").length;
    const pendingAssignments = assignments.filter((a) => a.status === "pending").length;
    const submittedAssignments = assignments.filter((a) => a.status === "submitted").length;
    const journeyProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    // Today's task (first pending or in-progress)
    const todayTasks = assignments
      .filter((a) => a.status === "pending" || a.status === "in-progress")
      .slice(0, 3);

    // Recent feedback from manager
    const recentFeedbacks = assignments
      .filter((a) => a.feedback && a.feedback.trim() !== "")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    // Course progress
    const totalCourses = await Course.countDocuments();
    const completedCourses = await TrainingProgress.countDocuments({ employee: user._id, isCompleted: true });
    const learningProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    // Assigned Projects
    const projects = await Project.find({ members: user._id }).select("title deadline status progress");

    // Earned Badges
    const allBadges = await Achievement.find();
    const myBadges = allBadges
      .filter((b) => b.recipients.some((r) => r.employee.toString() === user._id.toString()))
      .map((b) => ({
        _id: b._id,
        title: b.title,
        badgeCode: b.badgeCode,
        description: b.description,
        icon: b.icon,
        color: b.color
      }));

    // Journal entries count
    const journalCount = await JournalEntry.countDocuments({ employee: user._id });

    return res.status(200).json({
      success: true,
      summary: {
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        submittedAssignments,
        journeyProgress,
        todayTasks,
        recentFeedbacks,
        learningProgress,
        projects,
        myBadges,
        journalCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
