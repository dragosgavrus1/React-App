import mongoose, { Schema, Document } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the interface for the user document
export interface IUser extends Document {
    user_id: number;
    username: string;
    password: string;
}

// Define the schema for the user model
const userSchema: Schema = new Schema({
    user_id: Number,
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// Define auto-incrementing ID field
userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

// Define and export the UserModel
export const UserModel = mongoose.model<IUser>('users', userSchema);
