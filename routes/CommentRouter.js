import express from 'express';
import { createComment, fetchCommentsPerNoteId } from '../controllers/CommentController.js';

const CommentRouter = express.Router();

CommentRouter.post('/', async (req, res, next) => {
	try {
		await createComment(req, res);
	} catch (error) {
		next(error);
	}
});

CommentRouter.get('/note/:noteId', async (req, res, next) => {
	try {
		await fetchCommentsPerNoteId(req, res);
	} catch (error) {
		next(error);
	}
})

export default CommentRouter;
