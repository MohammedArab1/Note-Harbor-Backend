import { v4 } from 'uuid';
import { Comment } from '../database/models/comment.js';
import { Request, Response } from 'express';

export const createComment = async (req: Request, res: Response) => {
	const { content, inReplyTo, note } = req.body;
    const userId = req.auth.id;
	const newComment = new Comment({
		_id: v4(),
		user:userId,
        content,
        inReplyTo:inReplyTo || null,
        note
    });
	await newComment.save();
	const populatedComment = await Comment.findById(newComment._id);
	res.status(201).json(populatedComment);
};


export const fetchCommentsPerNoteId = async (req: Request, res: Response) => {
    const { noteId } = req.params;
	const comments = await Comment.find({ note:noteId });
	res.status(200).json(comments);
}