const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CrowdingRawSchema = new Schema({
    parco: { type: Schema.Types.ObjectId, ref: 'Parco', required: true },
    timestamp: { type: Date, default: Date.now },
    crowding: { type: Number, min: 1, max: 5, required: true }
});

module.exports = mongoose.model('CrowdingRaw', CrowdingRawSchema);