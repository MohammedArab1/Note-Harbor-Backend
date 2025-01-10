import { Types } from "mongoose";
export interface ISource {
	_id: Types.ObjectId;
	source: string;
	additionalSourceInformation: string;
}

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

export interface IComment {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	content: string;
	inReplyTo: Types.ObjectId;
  dateCreated: Date;
	dateUpdated?: Date;
  note: Types.ObjectId;
}

export interface IProject {
	_id: Types.ObjectId
	members?: Types.ObjectId[];
	creationDate: Date;
	accessCode: string;
	leader: Types.ObjectId;
  projectName: string;
	description?: string;
	private: boolean;
}

export interface ISubSection {
	_id: Types.ObjectId
	project: Types.ObjectId;
	name: string;
	description?: string;
}

export interface ITag {
	_id: Types.ObjectId
	project: Types.ObjectId;
	tagName: string;
	notes?: Types.ObjectId[];
	colour: string;
  }

  export interface IUser {
	_id: Types.ObjectId
	firstName: string;
	lastName: string;
	password?: string;
	authProvider?: string;
	email: string;
	projects: Types.ObjectId[]
  }

type JwtPayload = {
	email: string;
	id: string;
}
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
	error: string
}

export type LoginPayload = {
	token: string
	user: IUser
}

export type NoteWithTags = INote & {
	tags: ITag[]
}