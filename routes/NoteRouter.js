import express from 'express';
import { createNote, deleteNote, getNoteByProjectId } from '../controllers/NoteController.js';

const NoteRouter = express.Router();

NoteRouter.post('/', async (req, res, next) => {
	try {
		await createNote(req, res);
	} catch (error) {
		next(error);
	}
});

NoteRouter.post('/deleteMany', async (req, res, next) => {
	try {
		await deleteNote(req,res)
	} catch (error) {
		next(error);
	}
})

NoteRouter.get('/project/:projectId', async (req, res, next) => {
	try {
		await getNoteByProjectId(req, res);
	} catch (error) {
		next(error);
	}
})

export default NoteRouter;
