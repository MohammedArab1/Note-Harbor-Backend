import { run } from './app.js';
import { error } from './utils/logger.js';

const PORT = process.env.PORT || 3006;
try {
	run()
} catch (err) {
	// error('unable to start server. See error: ', err);
	throw new Error(`unable to start server. See error: ${err}`)
}
