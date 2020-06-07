const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 7
    },
    age: {
        type: Number,
        required: true,
        min: 13
    },
    gender:{
        type:String
    },
    invitationGot: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    accepted: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    rejected: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    unseenInvitation: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    unseenEventAccepted: [{
        type: String
    }]
}, {
    timestamps: true
})

userSchema.virtual('event', {
    ref: 'event',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.notificationCount = function(){
    const user = this
    let notificationCount = 0
    notificationCount += this.unseenInvitation.length
    notificationCount += this.unseenEventAccepted.length
    return notificationCount
}

//to hash password everytime when password is changed
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User;