import express from 'express';
import { createTag } from '../controllers/TagController.js';

const TagRouter = express.Router();

TagRouter.post('/', async (req, res, next) => {
	try {
		await createTag(req, res);
	} catch (error) {
		next(error);
	}
});

export default TagRouter;
