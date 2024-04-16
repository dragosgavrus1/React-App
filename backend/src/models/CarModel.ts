import mongoose, { Schema, Document } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the interface for the car document
export interface ICar extends Document {
    id: number;
    make: string;
    carModel: string;
    year: number;
    color: string;
}

// Define the schema for the car model
const carSchema: Schema = new Schema({
    id: Number,
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true }
});

// Define auto-incrementing ID field
carSchema.plugin(AutoIncrement, {inc_field: 'id'});

// Define and export the CarModel
export const CarModel = mongoose.model<ICar>('cars', carSchema);
