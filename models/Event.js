const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const eventSchema = new mongoose.Schema({
    authorId:{type:String,required:true},
    title: { type: String, required: true },
    eventType: { type: String, enum: ['Bridge Damage','River Overflow','Obstacle On Road','Route blocked due to some reason'] },
    scale:{type:String,enum:['low','medium','high']},
    image:{type:String,required:false},
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
eventSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Event', eventSchema);
