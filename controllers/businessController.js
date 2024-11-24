import { pool } from "../database/db.js";

const getBusiness = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          b.id, 
          b.name, 
          b.location, 
          t.name AS type_name
        FROM 
          businesses b
        JOIN 
          types t ON b.type_id = t.id
      `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No businesses found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM businesses WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

const createBusiness = async (req, res) => {
  try {
    const { name, type_id, location } = req.body;

    if (
      !location ||
      typeof location.x !== "number" ||
      typeof location.y !== "number"
    ) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const formattedLocation = `(${location.x}, ${location.y})`;

    // Convert the business name to lowercase before querying the database
    const lowercaseName = name.toLowerCase();

    const existingBusiness = await pool.query(
      "SELECT * FROM businesses WHERE LOWER(name) = $1",
      [lowercaseName]
    );

    if (existingBusiness.rows.length > 0) {
      return res.status(400).json({ message: "Business name already exists" });
    }

    const result = await pool.query(
      "INSERT INTO businesses (name, type_id, location) VALUES ($1, $2, $3) RETURNING *",
      [name, type_id, formattedLocation]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type_id, location } = req.body;

    // Validate location if provided
    if (
      location &&
      (typeof location.x !== "number" || typeof location.y !== "number")
    ) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    // Format location if provided
    const formattedLocation = location
      ? `(${location.x}, ${location.y})`
      : null;

    const lowercaseName = name ? name.toLowerCase() : null;

    const existingBusiness = await pool.query(
      "SELECT * FROM businesses WHERE LOWER(name) = $1 AND id != $2", 
      [lowercaseName, id]
    );
    if (existingBusiness.rows.length > 0) {
      return res.status(400).json({ message: "Business name already exists" });
    }

    const fields = [];
    const values = [];
    let index = 1;

    // Add fields to update if provided
    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (type_id) {
      fields.push(`type_id = $${index++}`);
      values.push(type_id);
    }

    if (formattedLocation) {
      fields.push(`location = $${index++}`);
      values.push(formattedLocation);
    }

    // If no fields to update, return error
    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);

    const query = `
      UPDATE businesses 
      SET ${fields.join(", ")} 
      WHERE id = $${index} 
      RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBusiness = await pool.query(
      "SELECT * FROM businesses WHERE id = $1",
      [id]
    );
    if (existingBusiness.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }
    const result = await pool.query("DELETE FROM businesses WHERE id = $1", [
      id,
    ]);
    res.json({ message: "Business deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error", error: err.message});
  }
};

export {
  getBusiness,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
