import { ClientSession, Mongoose } from "mongoose";
import { ErrorPayload } from "../types.js";

export const createError = (message: string): ErrorPayload => {
  return {
    error: message
  }
}

export async function transact(client:Mongoose, callback: (session:ClientSession) => void) {
  const session = await client.startSession()
  session.startTransaction();
	try {
		callback(session)
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