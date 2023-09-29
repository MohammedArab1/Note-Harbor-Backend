import express from 'express';
import { createSource, findUniqueSourcesPerProjectId, deleteSourceBySourceId, deleteUniqueSourceByProjectId } from '../controllers/SourceController.js';

const SourceRouter = express.Router();

SourceRouter.post('/', async (req, res, next) => {
	try {
		await createSource(req, res);
	} catch (error) {
		next(error);
	}
});

SourceRouter.get('/project/:projectId/unique',async (req,res,next)=>{
	try {
		await findUniqueSourcesPerProjectId(req, res);
	} catch (error) {
		next(error);
	}
})

SourceRouter.post('/deleteUnique', async (req, res, next) => {
	try {
		await deleteUniqueSourceByProjectId(req, res);
	} catch (error) {
		next(error);
	}
});

SourceRouter.delete('/:tagId',async (req,res,next)=>{
	try {
		await deleteSourceBySourceId(req, res);
	} catch (error) {
		next(error);
	}
})

export default SourceRouter;
