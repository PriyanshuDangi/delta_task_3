const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user.js')
const Event = require('../models/event.js')
const {checkAuth, checkNotAuth} = require('../auth/checkauth.js')
const {convertdate, convertTime, inputTime} = require('../date/formatDate.js')
const {sendInvitation} = require('../emails/account.js')

const router = new express.Router()

//sending own event invitation page
router.get('/event/invite/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to invite')
            return res.redirect('/dashboard')
        }
        const allUsers = await User.find()
        allUninvitedUsers = allUsers.filter(user=>{
            if(user.name == req.user.name){
                return false
            }
            return !(event.sendTo.includes(user.name))
        })
        res.render('eventInvite', {
            event,
            allUninvitedUsers
        })
    }catch(err){
        req.flash('error_msg', 'Unable to invite')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//invite all button
router.get('/event/invite/:eid/all', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to invite everyone')
            return res.redirect('/event/invite/' + req.params.eid)
        }
        const allUsers = await User.find()
        allUninvitedUsers = allUsers.filter(user=>{
            if(user.name == req.user.name){
                return false
            }
            return !(event.sendTo.includes(user.name))
        })
        for(var i =0; i < allUninvitedUsers.length; i++){
            var user = allUninvitedUsers[i]
            event.sendTo = event.sendTo.concat(user.name)
            user.invitationGot = user.invitationGot.concat(req.params.eid)
            user.unseenInvitation = user.unseenInvitation.concat(req.params.eid)
            await user.save()
            sendInvitation(user.email, user.name, req.user.name, event.title, process.env.SITE_URL + 'event/other/view/' + req.params.eid)
        }
        await event.save()
        res.redirect('/event/invite/' + req.params.eid)
    }catch(err){
        req.flash('error_msg', 'Unable to invite everyone')
        res.redirect('/event/invite/' + req.params.eid)
        console.log(err)
    }
})

//invite specifically
router.get('/event/invite/:eid/:uid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        const user = await User.findOne({_id: req.params.uid}) 
        if(!event){
            req.flash('error_msg', 'Unable to invite ' + user.name)
            return res.redirect('/event/invite/' + req.params.eid)
        }
        if(user.invitationGot.includes(mongoose.Types.ObjectId(req.params.eid))){
            console.log('u are already invited')
            return res.redirect('/dashboard');
        }
        event.sendTo = event.sendTo.concat(user.name)
        user.invitationGot = user.invitationGot.concat(req.params.eid)
        user.unseenInvitation = user.unseenInvitation.concat(req.params.eid)
        await user.save()
        await event.save()
        sendInvitation(user.email, user.name, req.user.name, event.title, process.env.SITE_URL + 'event/other/view/' + req.params.eid)
        res.redirect('/event/invite/' + req.params.eid)
    }catch(err){
        req.flash('error_msg', 'Unable to invite ')
        res.redirect('/event/invite/' + req.params.eid)
        console.log(err)
    }
})

//own event invitation to see the information about event
router.get('/event/view/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to view information about the event')
            return res.redirect('/dashboard')
        }
        res.render('ownInvitation', {
            event,
            date: convertdate(event.datetime),
            time: convertTime(event.datetime)
        })
    }catch(err){
        req.flash('error_msg', 'Unable to view information about the event')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//other user event invitation
router.get('/event/other/view/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findById(req.params.eid)
        if(!event){
            req.flash('error_msg', 'Unable to get invitation card')
            return res.redirect('/dashboard')
        }
        if(!req.user.invitationGot.includes(mongoose.Types.ObjectId(req.params.eid))){
            req.flash('error_msg', 'Unable to get invitation card')
            return res.redirect('/dashboard')
        }
        event.ask = true
        if(req.user.accepted.includes(mongoose.Types.ObjectId(req.params.eid)) || req.user.rejected.includes(mongoose.Types.ObjectId(req.params.eid))){
            event.ask = false
        }
        await event.populate('owner').execPopulate()
        res.render('otherInvitation', {
            event,
            date: convertdate(event.datetime),
            time: convertTime(event.datetime)
        })
    }catch(err){
        req.flash('error_msg', 'Unable to get invitation card')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//accepting invitation
router.post('/event/accept/:eid', checkAuth, async(req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid})
        if(!req.user.invitationGot.includes(mongoose.Types.ObjectId(req.params.eid))){
            req.flash('error_msg', 'Unable to accept')
            return res.redirect('/event/other/view/' + req.params.eid)
        }
        if(!event){
            req.flash('error_msg', 'Unable to accept')
            return res.redirect('/event/other/view/' + req.params.eid)
        }
        if(event.deadline){
            var deadlineDate = new Date(event.deadline)
            var now = Date.now()
            if(deadlineDate < now){
                req.flash('error_msg', 'deadline to accept invitation went')
                console.log('deadline to accept event went')
                return res.redirect('/event/other/view/' + req.params.eid)
            }
        }
        req.user.accepted = req.user.accepted.concat(req.params.eid)
        event.usersResponse = event.usersResponse.concat(req.body.response)
        event.usersAccept = event.usersAccept.concat(req.user.name)
        await event.populate('owner').execPopulate()
        event.owner.unseenEventAccepted = event.owner.unseenEventAccepted.concat(req.user.name)
        await req.user.save()
        await event.save()
        req.flash('success_msg', 'your response is saved')
        res.redirect('/event/other/view/' + req.params.eid)
    }catch(err){
        req.flash('error_msg', 'unable to accept invitation')
        res.redirect('/event/other/view/' + req.params.eid)
        console.log(err)
    }
})

//rejecting invitation
router.post('/event/reject/:eid', checkAuth, async(req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid})
        if(!req.user.invitationGot.includes(mongoose.Types.ObjectId(req.params.eid))){
            req.flash('error_msg', 'Unable to accept')
            return res.redirect('/event/other/view/' + req.params.eid)
        }
        if(!event){
            req.flash('error_msg', 'Unable to delete event')
            console.log('unable to accept')
            return res.redirect('/event/other/view/' + req.params.eid)
        }
        if(event.deadline){
            var deadlineDate = new Date(event.deadline)
            // console.log(deadlineDate)
            var now = Date.now()
            // console.log(now)
            if(deadlineDate < now){
                req.flash('error_msg', 'deadline to reject invitation went')
                console.log('deadline to reject event went')
                return res.redirect('/event/other/view/' + req.params.eid)
            }
        }
        req.user.rejected = req.user.rejected.concat(req.params.eid)
        event.usersReject = event.usersReject.concat(req.user.name)
        await req.user.save()
        await event.save()
        req.flash('success_msg', 'your response is saved')
        res.redirect('/dashboard')
    }catch(err){
        req.flash('error_msg', 'unable to reject invitation')
        res.redirect('/event/other/view/' + req.params.eid)
        console.log(err)
    }
})

module.exports = router