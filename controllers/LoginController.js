import bcrypt from 'bcrypt';
import { User } from '../database/models/user.js';
import { createToken } from '../utils/Generators.js';
import { registerOAuthUser } from './UserController.js';

export const login = async (req, res) => {
	const { email, password, provider } = req.body;
	const existingUser = await User.findOne({ email }).select('+password');
	if (provider != null && existingUser == null) {
		await registerOAuthUser(req, res);
		return;
	} else if (provider != null && existingUser != null) {
		if (existingUser.authProvider != provider) {
			return res.status(401).json({
				error: 'A user with this email already exists in the database.',
			});
		} else {
			const token = createToken(existingUser);
			res.status(200).send({ token, user: existingUser });
			return;
		}
	} else if (
		provider == null &&
		existingUser != null &&
		existingUser.authProvider != null
	) {
		return res.status(401).json({
			error: 'A user with this email already exists in the database.',
		});
	}
	const passwordCorrect =
		existingUser === null
			? false
			: await bcrypt.compare(password, existingUser.password);
	if (!existingUser || !passwordCorrect) {
		return res.status(401).json({ error: 'Invalid username or password' });
	}
	delete existingUser.password;
	const token = createToken(existingUser);
	res.status(200).send({ token, user: existingUser });
};
