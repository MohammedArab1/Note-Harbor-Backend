import { info } from "./logger.js";
import {Request, Response, NextFunction} from 'express'
import { ErrorRequestHandler } from "express";


// export const errorHandler: ErrorRequestHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
// 	if (error.name === 'CastError') {
// 		return response.status(400).send({ error: 'malformatted id' });
// 	} else if (error.name === 'ValidationError') {
// 		return response.status(400).json({ error: error.message });
// 	} else if (error.name === 'JsonWebTokenError') {
// 		return response.status(400).json({ error: error.message });
// 	} else if (error.name === 'UnauthorizedError') {
// 		return response.status(401).json({ error: error.message });
// 	} else if (error.name === 'TokenExpiredError') {
// 		return response.status(401).json({ error: 'token expired' });
// 	} else {
// 		return response.status(500).json({ error: error.message });
// 	}
// };

export const errorHandler: ErrorRequestHandler = (
	error: any,
	request: Request,
	response: Response,
	next: NextFunction
  ) => {
	if (error.name === 'CastError') {
	  response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
	  response.status(400).json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
	  response.status(400).json({ error: error.message });
	} else if (error.name === 'UnauthorizedError') {
	  response.status(401).json({ error: error.message });
	} else if (error.name === 'TokenExpiredError') {
	  response.status(401).json({ error: 'token expired' });
	} else {
	  response.status(500).json({ error: error.message });
	}
  };

export const requestLogger = (request: Request,response: Response, next: NextFunction) => {
    info("Method: ", request.method)
    info("Path: ", request.path)
    info("Body: ", request.body)
    info("---")
    next()
}