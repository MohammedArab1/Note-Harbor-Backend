import { info } from "./logger.js";

export const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(400).json({ error: error.message });
	} else if (error.name === 'UnauthorizedError') {
		return response.status(401).json({ error: error.message });
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({ error: 'token expired' });
	} else {
		return response.status(500).json({ error: error.message });
	}
};

export const requestLogger = (request,response,next) => {
    info("Method: ", request.method)
    info("Path: ", request.path)
    info("Body: ", request.body)
    info("---")
    next()
}