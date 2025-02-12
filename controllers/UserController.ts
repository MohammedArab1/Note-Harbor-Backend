import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { Project } from '../database/models/project.js';
import { User } from '../database/models/user.js';
import { LoginPayload, RegisterRequest } from '../types.js';
import { createToken } from '../utils/Generators.js';
import { createError, transact } from '../utils/Utils.js';
import { deleteProjectService } from './service/projectService.js';
import { v4 } from 'uuid';

const unableToDeleteUserString =
	'Unable to delete user. Please try again later.';

export const createUser = async (req: Request, res: Response) => {
	const { firstName, lastName, password, email } = req.body as RegisterRequest;
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ error: 'User already exists' });
	}
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);
	let newUser = new User({
		_id: v4(),
		firstName,
		lastName,
		password: passwordHash,
		email,
	});

	let token: string | Error = '';
	try {
		await transact(mongoose, async (session: ClientSession) => {
			await newUser.save({ session });
			delete newUser.password;

			token = createToken(newUser);
			if (token instanceof Error) {
				throw new Error('Cannot create token when creating user');
			}
		});
	} catch (error) {
		return res.status(400).json(createError('Error registering'));
	}
	const returnObject: LoginPayload = { token, user: newUser };
	res.status(200).send(returnObject);
};

export const registerOAuthUser = async (req: Request, res: Response) => {
	const { firstName, lastName, email, provider } = req.body;
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ error: 'User already exists' });
	}
	let newUser = new User({
		firstName,
		lastName,
		email,
		authProvider: provider,
	});
	await newUser.save();
	newUser = newUser.toObject();
	const token = createToken(newUser);
	res.status(200).send({ registerSuccess: 'success', token, user: newUser });
};

export const deleteUser = async (req: Request, res: Response) => {
	const userId = req.auth.id;
	try {
		var deletedUser;
		await transact(mongoose, async (session: ClientSession) => {
			const projects = await Project.find({ leader: userId }, null, {
				session,
			});
			if (!(projects.length > 0)) {
				throw new Error('Cannot find project with leader');
			}
			for (let project of projects) {
				await deleteProjectService(project._id, session);
			}
			deletedUser = await User.deleteOne({ _id: userId }, { session });
			if (!deletedUser.acknowledged) {
				throw new Error('Delete project service failure');
			}
		});
		return res.status(200).send(deletedUser);
	} catch (error) {
		return res.status(500).json(createError(unableToDeleteUserString));
	}
};
