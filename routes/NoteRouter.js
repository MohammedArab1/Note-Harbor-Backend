import express from 'express';
import { createNote, deleteNote } from '../controllers/NoteController.js';

const NoteRouter = express.Router();

NoteRouter.post('/', async (req, res, next) => {
	try {
		await createNote(req, res);
	} catch (error) {
		next(error);
	}
});

NoteRouter.delete('/:noteId', async (req, res, next) => {
	try {
		await deleteNote(req,res)
	} catch (error) {
		next(error);
	}
})

export default NoteRouter;
