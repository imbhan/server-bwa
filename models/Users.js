const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const usersSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
    },
    
})

usersSchema.pre('save', async function(next) {
    const users = this;
    if (users.isModified('password')) {
        users.password = await bcrypt.hash(users.password, 8);
    }
})

module.exports = mongoose.model('Users', usersSchema)