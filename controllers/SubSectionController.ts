import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { SubSection } from '../database/models/subSection.js';
import { createError, transact } from '../utils/Utils.js';
import { deleteSubSectionService } from './service/subSectionService.js';

export const createSubSection = async (req: Request, res: Response) => {
	const { projectId, name, description } = req.body;
	const subSection = new SubSection({ project: projectId, name, description });
	await subSection.save();
	res.status(201).json(subSection);
};

export const deleteSubSection = async (req: Request, res: Response) => {
	const subSectionId = req.params.subSectionId;
    var deletedSubSection
	try {
		await transact(mongoose, async (session: ClientSession) => {
			const subsection = await SubSection.findOne({ _id: subSectionId }, null, {
				session,
			});
			if (!subsection) {
				throw new Error('subsection does not exist!');
			}
			deletedSubSection = await deleteSubSectionService(
				[subSectionId],
				session
			);
            if (!deletedSubSection.acknowledged) {
                throw new Error('Delete subsection service failure');
            }
		});
        return res.status(200).send(deletedSubSection);
	} catch (error: any) {
		return res
			.status(500)
			.json(createError(`Unable to delete sub section: ${error.message}`));
	}
};

export const getSubSectionByProjectId = async (req: Request, res: Response) => {
	const subsection = await SubSection.find({ project: req.params.projectId });
	return res.status(200).send(subsection);
};
