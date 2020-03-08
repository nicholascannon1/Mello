/**
 * index.js
 *
 * Server entry point.
 */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const socketio = require('socket.io');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') dotenv.config({path: '.env'});

/**
 * Project imports
 */
const auth = require('./config/auth');
const db = require('./config/db');
const secret = require('./config/globals').secret;

const app = express();
const port = 8000;

/**
 * Database set up
 */
const mongoose = db.connect();

/**
 * Authentication set up
 */
auth(passport);

/**
 * Middleware setup
 */
app.use(morgan('dev'));
app.use(helmet());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
	session({
		secret: secret,
		resave: true,
		saveUninitialized: true,
		store:
			process.env.NODE_ENV === 'production'
				? new MongoStore({
						mongooseConnection: mongoose.connection
				  })
				: session.MemoryStore()
	})
);
app.use(cors());

/**
 * Socket.io set up
 */
const server = http.createServer(app);
const io = socketio(server);
app.set('io', io);

/**
 * Mount API routes
 */
app.use('/auth/google', require('./routes/auth/auth'));
app.use('/api/list', require('./routes/api/lists'));
app.use('/api/task', require('./routes/api/tasks'));

/* Health check endpoint */
app.get('/api/health', (req, res) => {
	// get memory usage in MB
	const memUsage = process.memoryUsage();
	const memStats = {};
	for (let key in memUsage) {
		memStats[key] = Math.round((memUsage[key] / 1024 / 1024) * 100) / 100;
	}

	res.status(200).json(memStats);
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({message: err.message});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
