import { pool } from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// Get all admins
const getAdmin = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    if (result.rows.length === 0) {
        return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM admins WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin name already exists
    const existingAdmin = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: "Admin name already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin into the database
    const result = await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

// Update an admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    // Check if admin name already exists for another admin
    const existingAdmin = await pool.query(
      "SELECT * FROM admins WHERE username = $1 AND id != $2",
      [username, id]
    );
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: "Admin name already exists" });
    }

    // Hash the password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Update the admin
    const result = await pool.query(
      `UPDATE admins SET 
         username = $1, 
         password = COALESCE($2, password) 
       WHERE id = $3 
       RETURNING *`,
      [username, hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAdmin = await pool.query("SELECT * FROM admins WHERE id = $1", [id]);
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const result = await pool.query("DELETE FROM admins WHERE id = $1", [id]);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

// Login Admin and Generate JWT Token
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the admin exists in the database
    const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];

    // Compare the provided password with the stored hash
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,  // Secret key from .env
      { expiresIn: '1h' }  // Token expires in 1 hour
    );

    res.status(200).json({ token, username: admin.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

const logoutAdmin = (req, res) => {
  // JWT tokens are stateless, so logging out is done by removing the token on the client side
  res.status(200).json({ message: "Logged out successfully" });
};

export {
  getAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
};
