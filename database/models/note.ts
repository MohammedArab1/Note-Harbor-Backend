import mongoose, { Document, InferSchemaType, SchemaDefinitionType, Types } from 'mongoose';
import { INote } from '../../types.js';

const SourceSchema = new mongoose.Schema({
	_id:{
		type:String,
	},
	source: {
		type: String,
		required: true,
	},
	additionalSourceInformation: {
		type: String,
	},
});

const NoteSchema = new mongoose.Schema<INote>({
	_id:{
		type:String,
	},
	project: {
		type:String
	},
	subSection: {
		type:String
	},
	user: {
		type:String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateUpdated: {
		type: Date,
	},
	sources: {
		type: [SourceSchema],
		default: [],
		required: false,
	},
});

//Middleware that makes sure that only one of the two following fields is populated: project, subsection
NoteSchema.pre('validate', function (this:SchemaDefinitionType<INote>,next) {
	if ((this.project && this.subSection) || (!this.project && !this.subSection))
		return next(
			new Error(
				'At least and only one field (project, subsection) should be populated'
			)
		);
	next();
});

export const Note = mongoose.model('Note', NoteSchema);
