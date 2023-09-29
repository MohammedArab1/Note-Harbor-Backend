import mongoose from 'mongoose';

const SourceSchema = new mongoose.Schema({
	source: {
		type: String,
		required: true,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	},
	additionalSourceInformation: {
		type: String,
	},
	note: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		required: true
	}
});

export const Source = mongoose.model('Source', SourceSchema);
