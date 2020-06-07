const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Change the title'
    },
    header: {
        type: String,
        default: 'Header'
    },
    content: {
        type: String,
        default: 'Your text here...'
    },
    footer: {
        type: String,
        default: 'Footer'
    },
    datetime: {
        type: Date
    },
    deadline: {
        type:Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    sendTo: [{
        type: String
    }],
    usersAccept: [{
        type: String
    }],
    usersResponse: [{
        type: String
    }],
    usersReject: [{
        type:String
    }],
    present: [{
        type:String
    }]
},{
    timestamps: true
})

const Event = mongoose.model('event', eventSchema)

module.exports = Event