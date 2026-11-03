import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "smart_employee_jwt_secret_key_2026_super_secure", {
    expiresIn: "30d"
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  };

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: userObj
    });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, phone, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An employee with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      department: department || "Engineering",
      designation: designation || "New Recruit",
      phone: phone || "",
      bio: bio || "",
      manager: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide an email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is deactivated. Please contact HR." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (_req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("manager", "name email designation");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
