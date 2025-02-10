import express from 'express';
import { createUser, deleteUser } from '../controllers/UserController.js';
import { User } from '../database/models/user.js';

const UserRouter = express.Router();

UserRouter.post('/register', async (req, res, next) => {
	try {
		await createUser(req, res);
	} catch (error) {
		next(error);
	}
});

UserRouter.get('/', async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(201).json(users);
	} catch (error) {
		next(error);
	}
});

UserRouter.delete('/', async (req, res, next) => {
	try {
		await deleteUser(req, res);
	} catch (error) {
		next(error);
	}
});

export default UserRouter;
