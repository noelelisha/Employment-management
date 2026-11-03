import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getEmployees = async (req, res) => {
  try {
    const { role, department, search, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } }
      ];
    }

    const employees = await User.find(query)
      .populate("manager", "name email designation")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: employees.length, employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).populate("manager", "name email designation");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { name, department, designation, phone, bio, role, isActive, onboardingStatus, manager } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (department) fieldsToUpdate.department = department;
    if (designation) fieldsToUpdate.designation = designation;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (manager !== undefined) fieldsToUpdate.manager = manager || null;
    if (onboardingStatus) fieldsToUpdate.onboardingStatus = onboardingStatus;

    // Only admin can change role
    if (role && req.user.role === "admin") {
      fieldsToUpdate.role = role;
    }
    if (isActive !== undefined && (req.user.role === "admin" || req.user.role === "hr")) {
      fieldsToUpdate.isActive = isActive;
    }

    const employee = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).populate("manager", "name email");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Employee account ${employee.isActive ? "activated" : "deactivated"} successfully`,
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    // Return all active employees for directory/messaging
    const members = await User.find({ isActive: true }).select("name email role department designation phone");
    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
