import bcrypt from 'bcrypt';
import { User } from '../database/models/user.js';
import { createToken } from '../utils/Generators.js';
import { registerOAuthUser } from './UserController.js';
import { Request, Response } from 'express';
import { IUser, LoginPayload, LoginRequest } from '../types.js';
import { createError } from '../utils/Utils.js';

const emailAlreadyExistsString = `A user with this email already exists in the database.`
const invalidUsernameOrPasswordString = `Invalid username or password.`
const unknownIssue = `There was an issue with your login, please try again later.`

export const login = async (req: Request, res: Response) => {
	const { email, password, authProvider } = req.body as LoginRequest;
	const existingUser = await User.findOne({ email }).select('+password');
	if (authProvider != null && existingUser == null) {
		await registerOAuthUser(req, res);
		return;
	} else if (authProvider != null && existingUser != null) {
		if (existingUser.authProvider != authProvider) {
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
		authProvider == null &&
		existingUser != null &&
		existingUser.authProvider != null
	) {
		return res.status(401).json(createError(emailAlreadyExistsString));
	}
	var passwordCorrect = false
	if (existingUser != null && password != null) {
		passwordCorrect = await bcrypt.compare(password, existingUser.password || "");
	}

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
