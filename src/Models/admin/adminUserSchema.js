import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  otp: { type: String }, // current OTP for login
  otpExpiresAt: { type: Date }, // OTP expiration timestamp
  lastLogin: { type: Date },
  isVerified: { type: Boolean, default: false }, // true if OTP verified
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
