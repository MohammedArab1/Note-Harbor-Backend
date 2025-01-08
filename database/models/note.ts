import mongoose, { SchemaDefinitionType, Types } from 'mongoose';

export interface ISource {
	_id: Types.ObjectId;
	source: string;
	additionalSourceInformation: string;
}

const SourceSchema = new mongoose.Schema({
	source: {
		type: String,
		required: true,
	},
	additionalSourceInformation: {
		type: String,
	},
});

export interface INote {
	_id: Types.ObjectId;
	project?: Types.ObjectId;
	subSection?: Types.ObjectId;
	user: Types.ObjectId;
	content: string;
	dateCreated: Date;
	dateUpdated?: Date;
	sources?: ISource[];
}

const NoteSchema = new mongoose.Schema({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
	},
	subSection: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SubSection',
	},
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
