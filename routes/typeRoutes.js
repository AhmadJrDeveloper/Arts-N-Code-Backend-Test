import { Router } from "express";
import {
  createType,
  getType,
  getTypeById,
  updateType,
  deleteType,
} from "../controllers/typeController.js";
import { authenticateToken } from "../middleware/auth.js";

const typeRouter = Router();

typeRouter.get("/", getType);
// typeRouter.get("/:id", getTypeById);

//protected routes
typeRouter.post("/",  createType);
typeRouter.put("/:id", authenticateToken, updateType);
typeRouter.delete("/:id", authenticateToken, deleteType);


export default typeRouter;
