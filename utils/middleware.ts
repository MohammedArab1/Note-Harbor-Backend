import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { info } from './logger.js';

export const errorHandler: ErrorRequestHandler = (
	error: Error,
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

export const requestLogger = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	info('Method: ', request.method);
	info('Path: ', request.path);
	info('Body: ', request.body);
	info('---');
	next();
};
