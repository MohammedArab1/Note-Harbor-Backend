import { ErrorPayload } from "../types.js";
import { Document, Mongoose } from "mongoose";

export const createError = (message: string): ErrorPayload => {
  return {
    error: message
  }
}

export async function transact(client:Mongoose, callback: ()=> void) {
  const session = await client.startSession()
  session.startTransaction();
	try {
		callback()
		await session.commitTransaction();
		session.endSession();
		// return res.status(200).send(deletedNote);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		// return res.status(500).json({ error });
    throw error
	}

} 