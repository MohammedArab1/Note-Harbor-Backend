import express from 'express';
import { createNote, deleteNote, getNoteByProjectId, getNoteBySubSectionId, updateNoteByNoteId, getNotesByProjectAndSubsections } from '../controllers/NoteController.js';

const NoteRouter = express.Router();

NoteRouter.post('/', async (req, res, next) => {
	try {
		await createNote(req, res);
	} catch (error) {
		next(error);
	}
});

NoteRouter.post('/allNotes',async (req, res, next) => {
	try {
		await getNotesByProjectAndSubsections(req, res);
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

NoteRouter.get('/subsection/:subSectionId', async (req, res, next) => {
	try {
		await getNoteBySubSectionId(req, res);
	} catch (error) {
		next(error);
	}
})

NoteRouter.patch('/:noteId', async (req, res, next) => {
	try {
		await updateNoteByNoteId(req, res);
	} catch (error) {
		next(error);
	}
})

export default NoteRouter;
