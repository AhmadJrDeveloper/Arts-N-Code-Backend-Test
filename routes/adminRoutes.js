import { Router } from "express";
import {
  createAdmin,
  getAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";

const adminRouter = Router();

//protected routes
adminRouter.get("/", authenticateToken, getAdmin);
adminRouter.get("/:id", authenticateToken, getAdminById);
adminRouter.post("/", authenticateToken, createAdmin);
adminRouter.put("/:id", authenticateToken, updateAdmin);
adminRouter.delete("/:id", authenticateToken, deleteAdmin);


adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);

export default adminRouter;
