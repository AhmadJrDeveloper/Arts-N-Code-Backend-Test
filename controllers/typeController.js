import { pool } from "../database/db.js";

const getType = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM types");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM types WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createType = async (req, res) => {
  try {
    const { name } = req.body;
    const lowercaseName = name.toLowerCase();

    const existingType = await pool.query(
      "SELECT * FROM types WHERE LOWER(name) = $1",
      [lowercaseName]
    );
    if (existingType.rows.length > 0) {
      return res.status(400).json({ message: "Type name already exists" });
    }
    const result = await pool.query(
      "INSERT INTO types (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const lowercaseName = name.toLowerCase();

    const existingType = await pool.query(
      "SELECT * FROM types WHERE LOWER(name) = $1 AND id != $2",
      [lowercaseName, id]
    );
    if (existingType.rows.length > 0) {
      return res.status(400).json({ message: "Type name already exists" });
    }

    // Updating the type in the database
    const result = await pool.query(
      "UPDATE types SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteType = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the type exists
    const existingType = await pool.query("SELECT * FROM types WHERE id = $1", [
      id,
    ]);
    if (existingType.rows.length === 0) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Check if the type is associated with any businesses
    const businessCheck = await pool.query(
      "SELECT * FROM businesses WHERE type_id = $1",
      [id]
    );
    if (businessCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete this type because it is associated with a business",
      });
    }

    // Delete the type if not associated with any businesses
    await pool.query("DELETE FROM types WHERE id = $1", [id]);
    res.json({ message: "Type deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { getType, getTypeById, updateType, deleteType, createType };
