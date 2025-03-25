let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: { 
        type: String, 
        default: '',
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]*$/.test(v); // Chỉ cho phép chữ cái và khoảng trắng
            },
            message: props => `${props.value} không phải là fullName hợp lệ! Chỉ cho phép chữ cái và khoảng trắng.`
        }
    },
    avatarUrl: { 
        type: String, 
        default: '',
        validate: {
            validator: function(v) {
                if (!v) return true; // Cho phép chuỗi rỗng
                return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v); // Kiểm tra URL hợp lệ
            },
            message: props => `${props.value} không phải là URL hợp lệ!`
        }
    },
    status: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0, min: 0 },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
    }
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
});

module.exports = mongoose.model('user', userSchema);