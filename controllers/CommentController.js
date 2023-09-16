import { Comment } from '../database/models/comment.js';

export const createComment = async (req, res) => {
	const { content, inReplyTo, note } = req.body;
    const userId = req.auth.id;
	const newComment = new Comment({
		user:userId,
        content,
        inReplyTo:inReplyTo || null,
        note
    });
	await newComment.save();
	res.status(201).json(newComment);
};
