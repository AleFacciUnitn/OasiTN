const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const crowdingDataSchema = new Schema({
    parco: { type: Schema.Types.ObjectId, ref: 'Parco', required: true },
    day: { 
        type: String, 
        required: true,
        enum: validDays 
    },
    crowding: { type: Number, min: 1, max: 5, required: true }
});

module.exports = mongoose.model('CrowdingData', crowdingDataSchema);