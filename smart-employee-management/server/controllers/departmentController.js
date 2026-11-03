import Department from "../models/Department.js";
import User from "../models/User.js";

export const getDepartments = async (_req, res) => {
  try {
    const departments = await Department.find().populate("manager", "name email designation");

    // Attach employee counts for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await User.countDocuments({ department: dept.name, isActive: true });
        return {
          ...dept.toObject(),
          employeeCount
        };
      })
    );

    res.status(200).json({ success: true, departments: departmentsWithCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("manager", "name email");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const employees = await User.find({ department: department.name, isActive: true }).select("name email designation role");
    res.status(200).json({ success: true, department, employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, manager, responsibilities } = req.body;

    const existing = await Department.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return res.status(400).json({ message: "Department with this name or code already exists" });
    }

    const department = await Department.create({
      name,
      code,
      description,
      manager: manager || null,
      responsibilities: responsibilities || []
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("manager", "name email");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Department removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
