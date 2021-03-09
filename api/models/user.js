const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true},
	water: { type: Number, required: true},
	institute: { type: String}
});

module.exports = mongoose.model('User', userSchema);