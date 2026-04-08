import mongoose from 'mongoose';


const alertSchema = new mongoose.Schema({
     animal: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    sensorId: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    actionTaken: {
        type: String,
        default: null
    },
    time: {
        type: Date,
        default: Date.now   

     }
});
const alertModel = mongoose.model('Alert', alertSchema);

export default alertModel;