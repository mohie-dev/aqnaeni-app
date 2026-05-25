import mongoose from "mongoose";

// Generate a random 6-character alphanumeric code for session identification
export const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Helper function to convert string ID to ObjectId
export const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

// Normalize ID from request parameters, handling both string and array formats
export const normalizeId = (id: string | string[]) => {
  return Array.isArray(id) ? id[0] : id;
};