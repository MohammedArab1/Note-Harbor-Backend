import express from 'express';
import { createComment } from '../controllers/CommentController.js';

const CommentRouter = express.Router();

CommentRouter.post('/', async (req, res, next) => {
	try {
		await createComment(req, res);
	} catch (error) {
		next(error);
	}
});

export default CommentRouter;
