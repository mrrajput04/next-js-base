import mongoose from 'mongoose';
import { logger } from '../lib/logger';

export interface IUser {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add any pre-save hooks, methods, or statics here
userSchema.pre('save', function (next) {
  logger.info(`Saving user: ${this.email}`);
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 