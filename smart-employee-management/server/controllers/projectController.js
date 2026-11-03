import Project from "../models/Project.js";
import ProjectTask from "../models/ProjectTask.js";

// Get projects (Admins/HR see all; Managers see their managed/department projects; Employees see projects they are assigned to)
export const getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "manager") {
      query = { $or: [{ manager: req.user._id }, { department: req.user.department }] };
    } else if (req.user.role === "employee") {
      query = { members: req.user._id };
    }

    const projects = await Project.find(query)
      .populate("manager", "name email designation")
      .populate("members", "name email designation department")
      .sort({ createdAt: -1 });

    // Compute task counts and progress
    const projectsWithDetails = await Promise.all(
      projects.map(async (p) => {
        const tasks = await ProjectTask.find({ project: p._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === "completed").length;
        const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : p.progress;

        return {
          ...p.toObject(),
          totalTasks,
          completedTasks,
          progress: calculatedProgress
        };
      })
    );

    res.status(200).json({ success: true, count: projectsWithDetails.length, projects: projectsWithDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("manager", "name email designation")
      .populate("members", "name email designation department");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await ProjectTask.find({ project: project._id })
      .populate("assignedTo", "name email designation")
      .populate("assignedBy", "name email")
      .sort({ dueDate: 1 });

    res.status(200).json({ success: true, project, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, department, deadline, members, status } = req.body;

    const project = await Project.create({
      title,
      description,
      department: department || req.user.department || "Engineering",
      manager: req.user._id,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      members: members || [req.user._id],
      status: status || "in-progress"
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("manager", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await ProjectTask.deleteMany({ project: req.params.id });
    res.status(200).json({ success: true, message: "Project and associated tasks removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Project Tasks
export const getMyProjectTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "employee") {
      query = { assignedTo: req.user._id };
    } else if (req.user.role === "manager") {
      query = { assignedBy: req.user._id };
    }

    const tasks = await ProjectTask.find(query)
      .populate("project", "title status department deadline")
      .populate("assignedTo", "name email designation")
      .populate("assignedBy", "name email")
      .sort({ dueDate: 1 });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProjectTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, dueDate, priority } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await ProjectTask.create({
      project: projectId,
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: priority || "medium"
    });

    // Make sure employee is in project members
    if (!project.members.includes(assignedTo)) {
      project.members.push(assignedTo);
      await project.save();
    }

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitProjectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionText, attachmentUrl } = req.body;

    const task = await ProjectTask.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only submit your own tasks" });
    }

    task.submissionText = submissionText || task.submissionText;
    task.attachmentUrl = attachmentUrl || task.attachmentUrl;
    task.status = "submitted";

    await task.save();

    res.status(200).json({ success: true, message: "Project task submitted for manager review", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewProjectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, status } = req.body;

    const task = await ProjectTask.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.feedback = feedback !== undefined ? feedback : task.feedback;
    task.status = status || "completed";
    if (task.status === "completed") {
      task.completedAt = new Date();
    }

    await task.save();

    res.status(200).json({ success: true, message: "Task review submitted", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
