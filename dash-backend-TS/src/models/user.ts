import { Schema, Model, model } from 'mongoose';
import { IUser, Location, SALT, UserType, UserValidFields } from '../types/user';
import bcrypt from 'bcryptjs';


const userSchema: Schema<IUser> = new Schema(
    { 
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        type: { type: String, required: true, enum: ['asha', 'user', 'admin'] },
        location: { 
            type: { 
                type: String, 
                enum: ['Point'],
                required: true 
            },
            coordinates: { 
                type: [Number],
                required: true
            }
        }, 
        lastActive: { type: Date, required: true, default: new Date() },
        stocks: [{ type: Schema.Types.ObjectId, ref: 'Stock' }],
        payments: [{ type: String }],
        balance: { type: Number, default: 1500 },
    },
    { timestamps: true }
);

userSchema.index({ location: '2dsphere' });


// Encrypt password before saving (for security in production)
userSchema.pre<IUser>('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10); 
    this.password = hashedPassword;
    next();
});

const UserModel: Model<IUser> = model<IUser>('User', userSchema);

class User {
    private userModel: Model<IUser>;

    constructor() {
        this.userModel = UserModel;
    }

    // Create a new user
    public async createUser(name: string, phone: string, password: string, type: UserType, location: Location): Promise<IUser> {
        const user = new this.userModel({ name, phone, password, type, location, lastActive: new Date() });
        return user.save();
    }

    // Find a user by ID
    public async findUserById(userId: string): Promise<IUser | null> {
        return this.userModel.findOne({ _id: userId }).exec();
    }

    // Find a user by phone
    public async findUserByEmail(phone: string): Promise<IUser | null> {
        return this.userModel.findOne({ phone }).exec();
    }

    // Find user by a custom field (e.g., type or phone)
    public async findUserByField(field: string, value: string): Promise<IUser | null> {
        const validFields = ['_id', 'phone', 'type']; // Only allow specific fields to be queried
        if (!validFields.includes(field)) throw new Error(`Invalid field: ${field}`);
        return this.userModel.findOne({ [field]: value }).exec();
    }

    // Update a user's name
    public async updateUserName(userId: string, newName: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { name: newName },
            { new: true }
        ).exec();
    }

    public async updateEmail (userId: string, newEmail: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { phone: newEmail },
            { new: true }
        ).exec();
    }

    public async updatePassword (userId: string, newPassword: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { password: newPassword },
            { new: true }
        ).exec();
    }

    public async updateBalance(userId: string, bid: number): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: -bid } },
            { new: true }
        ).exec();
    }

    public async updateField (userId: string, field: string, value: any): Promise<IUser | null> {
        // Check if field is valid using UserValidField type
        if(!(field as UserValidFields)) throw new Error(`Invalid field: ${field}`);
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { [field]: value },
            { new: true }
        ).exec();
    }

    // Validate user password
    public async validatePassword(user: IUser, inputPassword: string): Promise<boolean> {
        if (user) {
            return bcrypt.compare(inputPassword, user.password);  // Use bcrypt to compare hashed passwords
        }
        return false;
    }

    // Update last active date when the user is active
    public async updateLastActive(userId: string): Promise<IUser | null> {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { lastActive: new Date() },
            { new: true }
        ).exec();
    }
}

export { UserModel };

export default User;
