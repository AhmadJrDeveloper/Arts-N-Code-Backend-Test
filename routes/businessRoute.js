import { Router } from "express";
import {
  getBusiness,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../controllers/businessController.js";
import { authenticateToken } from "../middleware/auth.js";

const businessRouter = Router();

// Public routes
businessRouter.get("/", getBusiness);
businessRouter.get("/:id", getBusinessById);
businessRouter.post("/", createBusiness);

// Protected routes (require authentication)
businessRouter.put("/:id", authenticateToken, updateBusiness);
businessRouter.delete("/:id", authenticateToken, deleteBusiness);

export default businessRouter;
