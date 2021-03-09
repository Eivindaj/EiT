const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/users');
const loggRoutes = require('./api/routes/loggs');


mongoose.connect('mongodb+srv://EiT:'+ 
	process.env.MONGO_ATLAS_PW +
	'@eit.6kf97.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true',
	{ useNewUrlParser: true,
	 useUnifiedTopology: true}
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Orign', '*');
	res.header('Access-Control-Allow-Headers', 'Orign, X-Requested-With, Coutent-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});
app.use('/loggs', loggRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) =>{
	const error = new Error('Not found');
	error.status= 404;
	next(error);
});

app.use((error, req, res, next) =>{
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;