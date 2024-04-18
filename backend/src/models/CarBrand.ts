import mongoose, { Schema, Document } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the interface for the car document
export interface IBrand extends Document {
    brand_id: number;
    brand: string;
}

// Define the schema for the car model
const brandSchema: Schema = new Schema({
    brand_id: Number,
    brand: { type: String, required: true }
});

// Define auto-incrementing ID field
brandSchema.plugin(AutoIncrement, {inc_field: 'brand_id'});

// Define and export the CarModel
export const BrandModel = mongoose.model<IBrand>('brands', brandSchema);
