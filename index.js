import { app } from './app.js';
import connectToDb from './database/connect.js';
import { error } from './utils/logger.js';

const PORT = process.env.PORT || 3006;
try {
	app.listen(PORT, () => {
		`Server running on port ${PORT}`;
	});
} catch (err) {
	error('unable to start server. See error: ', err);
}
