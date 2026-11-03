import ConfidenceTaskTemplate from "../models/ConfidenceTaskTemplate.js";
import EmployeeTaskAssignment from "../models/EmployeeTaskAssignment.js";
import User from "../models/User.js";

// List all confidence task templates (can filter by category, week, department)
export const getTemplates = async (req, res) => {
  try {
    const { category, weekNumber, department } = req.query;
    const query = {};
    if (category) query.category = category;
    if (weekNumber) query.weekNumber = Number(weekNumber);
    if (department && department !== "All") {
      query.$or = [{ department: "All" }, { department }];
    }

    const templates = await ConfidenceTaskTemplate.find(query).sort({ dayNumber: 1 });
    res.status(200).json({ success: true, count: templates.length, templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task template (Admin/HR)
export const createTemplate = async (req, res) => {
  try {
    const template = await ConfidenceTaskTemplate.create(req.body);
    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign 30-day journey to an employee (HR/Manager/Admin)
export const assignJourneyToEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Get all general-journey templates
    const templates = await ConfidenceTaskTemplate.find({ category: "general-journey" }).sort({ dayNumber: 1 });

    let createdCount = 0;
    const now = new Date();

    for (const tpl of templates) {
      const existing = await EmployeeTaskAssignment.findOne({
        template: tpl._id,
        assignedTo: employee._id
      });

      if (!existing) {
        // Calculate due date (dayNumber days from now)
        const dueDate = new Date(now.getTime() + (tpl.dayNumber || 1) * 24 * 60 * 60 * 1000);

        await EmployeeTaskAssignment.create({
          template: tpl._id,
          assignedTo: employee._id,
          assignedBy: req.user._id,
          dueDate,
          status: "pending",
          completionPercentage: 0
        });
        createdCount++;
      }
    }

    // Also assign department-specific tasks for this employee's department
    const deptTemplates = await ConfidenceTaskTemplate.find({
      category: "department-specific",
      department: employee.department
    });

    for (const tpl of deptTemplates) {
      const existing = await EmployeeTaskAssignment.findOne({
        template: tpl._id,
        assignedTo: employee._id
      });
      if (!existing) {
        const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        await EmployeeTaskAssignment.create({
          template: tpl._id,
          assignedTo: employee._id,
          assignedBy: req.user._id,
          dueDate,
          status: "pending",
          completionPercentage: 0
        });
        createdCount++;
      }
    }

    employee.onboardingStatus = "in-progress";
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Assigned ${createdCount} development tasks to ${employee.name}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task assignments for current employee or specific employee (if manager/hr/admin)
export const getEmployeeAssignments = async (req, res) => {
  try {
    const targetUserId = req.query.employeeId || req.user._id;

    // Security check: non-manager/hr/admin can only access own tasks
    if (
      targetUserId.toString() !== req.user._id.toString() &&
      !["admin", "hr", "manager"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "You are not authorized to view this employee's assignments" });
    }

    const assignments = await EmployeeTaskAssignment.find({ assignedTo: targetUserId })
      .populate("template")
      .populate("assignedBy", "name email")
      .sort({ "template.dayNumber": 1, createdAt: 1 });

    const total = assignments.length;
    const completed = assignments.filter((a) => a.status === "completed").length;
    const submitted = assignments.filter((a) => a.status === "submitted").length;
    const inProgress = assignments.filter((a) => a.status === "in-progress").length;
    const pending = assignments.filter((a) => a.status === "pending").length;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        submitted,
        inProgress,
        pending,
        progressPercentage
      },
      assignments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee updates progress or submits assignment
export const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionText, attachmentUrl, status } = req.body;

    const assignment = await EmployeeTaskAssignment.findById(id).populate("template");
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Only assigned employee can submit
    if (assignment.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own assigned tasks" });
    }

    if (submissionText !== undefined) assignment.submissionText = submissionText;
    if (attachmentUrl !== undefined) assignment.attachmentUrl = attachmentUrl;

    if (status) {
      assignment.status = status;
      if (status === "submitted") {
        assignment.completionPercentage = 90;
      } else if (status === "in-progress") {
        assignment.completionPercentage = 50;
      }
    } else if (submissionText && assignment.status === "pending") {
      assignment.status = "submitted";
      assignment.completionPercentage = 90;
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Work submitted successfully! Your manager will review it.",
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager/Admin/HR reviews submission, gives feedback and grades
export const reviewAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, rating, status } = req.body;

    const assignment = await EmployeeTaskAssignment.findById(id).populate("assignedTo", "name email");
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (feedback !== undefined) assignment.feedback = feedback;
    if (rating !== undefined) assignment.rating = rating;
    if (status) {
      assignment.status = status;
      if (status === "completed") {
        assignment.completionPercentage = 100;
        assignment.completedAt = new Date();
      }
    } else {
      assignment.status = "completed";
      assignment.completionPercentage = 100;
      assignment.completedAt = new Date();
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Review and feedback recorded successfully",
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all submissions waiting for review (for Managers / HR / Admin)
export const getPendingReviews = async (req, res) => {
  try {
    const query = { status: "submitted" };

    const submissions = await EmployeeTaskAssignment.find(query)
      .populate("template")
      .populate("assignedTo", "name email department designation")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
