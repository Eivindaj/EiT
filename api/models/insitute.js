const mongoose = require('mongoose');

const InstituteSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true},
});

module.exports = mongoose.model('Institute', InstituteSchema);