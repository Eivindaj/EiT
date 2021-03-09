const mongoose = require('mongoose');


const loggSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userid: { type: String, required: true},
	date: { type: Date, required: true},
	water: { type: Number, required: true}
});

module.exports = mongoose.model('Logg', loggSchema);