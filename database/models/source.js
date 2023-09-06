import mongoose from 'mongoose';

const SourceSchema = new mongoose.Schema({
	source: {
		type: String,
		required: true,
	},
	note: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		required: true,
	},
	additionalInformation: {
		type: String,
		required: false,
	},
});

export const Source = mongoose.model('Source', SourceSchema);
