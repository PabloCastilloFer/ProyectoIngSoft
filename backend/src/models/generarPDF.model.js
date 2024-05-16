import { Schema, model } from 'mongoose';

const reportSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Report = model('Report', reportSchema);

export default Report;
