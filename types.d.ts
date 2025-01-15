import { Types } from 'mongoose';
export interface ISource {
	_id: Types.ObjectId;
	source: string;
	additionalSourceInformation: string;
}

export interface INote {
	_id: Types.ObjectId;
	project?: Types.ObjectId | IProject;
	subSection?: Types.ObjectId | ISubSection;
	user: Types.ObjectId | IUser;
	content: string;
	dateCreated: Date;
	dateUpdated?: Date;
	sources?: ISource[];
}

export interface IComment {
	_id: Types.ObjectId;
	user: Types.ObjectId | IUser;
	content: string;
	inReplyTo: Types.ObjectId | IComment;
	dateCreated: Date;
	dateUpdated?: Date;
	note: Types.ObjectId | INote;
}

export interface IProject {
	_id: Types.ObjectId;
	members?: Types.ObjectId[] | IUser[];
	creationDate: Date;
	accessCode: string;
	leader: Types.ObjectId | IUser;
	projectName: string;
	description?: string;
	private: boolean;
}

export interface ISubSection {
	_id: Types.ObjectId;
	project: Types.ObjectId | IProject;
	name: string;
	description?: string;
}

export interface ITag {
	_id: Types.ObjectId;
	project: Types.ObjectId | IProject;
	tagName: string;
	notes?: Types.ObjectId[] | INote[];
	colour: string;
}

export interface IUser {
	_id: Types.ObjectId;
	firstName: string;
	lastName: string;
	password?: string;
	authProvider?: string;
	email: string;
	projects: Types.ObjectId[] | IProject[];
}

type JwtPayload = {
	email: string;
	id: string;
};
declare global {
	namespace Express {
		export interface Request {
			auth: JwtPayload;
		}
		export interface Response {
			auth: JwtPayload;
		}
	}
}

export type ErrorPayload = {
	error: string;
};

export type LoginPayload = {
	token: string;
	user: IUser;
};

export type NoteWithTags = INote & {
	tags?: ITag[];
};
