import express from 'express';
import { createSource } from '../controllers/SourceController.js';

const SourceRouter = express.Router();

SourceRouter.post('/', async (req, res, next) => {
	try {
		await createSource(req, res);
	} catch (error) {
		next(error);
	}
});

export default SourceRouter;
