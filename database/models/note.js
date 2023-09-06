import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        required: false
    },
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: false,
        default: []
	}],
    sources: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Source',
		required: false,
        default: []
	}],
    tags: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tag',
		required: false,
        default: []
	}]
});

export const Note = mongoose.model('Note', NoteSchema);
