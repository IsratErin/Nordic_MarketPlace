import { Router } from 'express';
import { getAllUsers, getUserById, updateUserById } from '../controllers/userController.js';

const router = Router();

router.get('/allUsers', getAllUsers); // GET all users
router.get('/:id', getUserById); // GET user by ID
router.patch('/:id', updateUserById); // UPDATE user by ID

export default router;
