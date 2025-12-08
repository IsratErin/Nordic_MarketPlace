import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";

const router = Router();

router.get("/allUsers", getAllUsers); // GET all users
router.get("/:id", getUserById); // GET user by ID

export default router;
