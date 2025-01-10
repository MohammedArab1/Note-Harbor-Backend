import bcrypt from 'bcrypt';
import { User } from '../database/models/user.js';
import { createToken } from '../utils/Generators.js';
import { registerOAuthUser } from './UserController.js';
import { Request, Response } from 'express';
import { LoginPayload } from '../types.js';
import { createError } from '../utils/Utils.js';

const emailAlreadyExistsString = `A user with this email already exists in the database.`
const invalidUsernameOrPasswordString = `Invalid username or password.`
const unknownIssue = `There was an issue with your login, please try again later.`

export const login = async (req: Request, res: Response) => {
	const { email, password, provider } = req.body;
	const existingUser = await User.findOne({ email }).select('+password');
	if (provider != null && existingUser == null) {
		await registerOAuthUser(req, res);
		return;
	} else if (provider != null && existingUser != null) {
		if (existingUser.authProvider != provider) {
			return res.status(401).json(createError(emailAlreadyExistsString));
		} else {
			const token = createToken(existingUser);
			if (token instanceof Error) {
				return res.status(400).json(createError(unknownIssue))
			}
			const payload: LoginPayload = { token, user: existingUser } 
			res.status(200).send(payload);
			return;
		}
	} else if (
		provider == null &&
		existingUser != null &&
		existingUser.authProvider != null
	) {
		return res.status(401).json(createError(emailAlreadyExistsString));
	}
	const passwordCorrect =
		existingUser === null
			? false
			: bcrypt.compare(password, existingUser.password || "");
	if (!existingUser || !passwordCorrect) {
		return res.status(401).json(createError(invalidUsernameOrPasswordString));
	}
	delete existingUser.password;
	const token = createToken(existingUser);
	if (token instanceof Error) {
		return res.status(400).json(createError(unknownIssue))
	}
	const payload: LoginPayload = { token, user: existingUser }
	res.status(200).send(payload);
};
