import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, unique: true, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    isProfileComplete: { type: Boolean, default: false },
    profileCompletionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

userSchema.methods.calculateProfileCompletion = async function () {
  try {
    const UserProfile = mongoose.model('UserProfile');
    const profile = await UserProfile.findById(this._id);
    if (!profile) return { percentage: 0, isComplete: false };
    const requiredFields = [
      { field: 'dob', weight: 25 },
      { field: 'gender', weight: 20 },
      { field: 'location', weight: 25 },
      { field: 'class', weight: 20 },
      { field: 'stream', weight: 10 },
    ];
    let completedWeight = 0;
    const totalWeight = requiredFields.reduce((s, f) => s + f.weight, 0);
    requiredFields.forEach(({ field, weight }) => {
      if (profile[field] && profile[field] !== 'Prefer not to say' && profile[field] !== 'None') {
        completedWeight += weight;
      }
    });
    const percentage = Math.round((completedWeight / totalWeight) * 100);
    const isComplete = percentage === 100;
    this.profileCompletionPercentage = percentage;
    this.isProfileComplete = isComplete;
    await this.save();
    return { percentage, isComplete };
  } catch {
    return { percentage: 0, isComplete: false };
  }
};

export default mongoose.models.User || mongoose.model('User', userSchema);
