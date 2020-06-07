const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user.js')
const Event = require('../models/event.js')
const {checkAuth, checkNotAuth} = require('../auth/checkauth.js')
const {inputTime} = require('../date/formatDate.js')

const router = new express.Router()

//create event page
router.get('/event/create', checkAuth, async (req, res)=>{
    try{
        res.render('eventPage')
    }catch(err){
        req.flash('error_msg', 'Unable to get the event create page')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to show the edit event page
router.get('/event/edit/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to get the edit page')
            return res.redirect('/dashboard')
        }
        var deadline;
        if(event.deadline){
            deadline = inputTime(event.deadline)
        }
        res.render('editEvent', {
            event,
            startdate: inputTime(event.datetime),
            deadline
        })
    }catch(err){
        req.flash('error_msg', 'Unable to get the edit event page')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to submit the edited/created event
router.post('/event/edit/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOneAndUpdate({_id: req.params.eid, owner: req.user._id}, {...req.body}, {new: true, runValidators: true})
        if(!event){
            req.flash('error_msg', 'Sorry! Unable to edit')
        }
        res.status(200).send()
    }catch(err){
        req.flash('error_msg', 'Unable to edit this event')
        res.redirect('/event/edit/' + req.params.eid)
        console.log(err)
    }
})

//attendance page for event
router.get('/event/attendance/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to get attendance')
            return res.redirect('/dashboard')
        }
        if(!event.present){
            return res.render('attendance',{
                event
            })
        }
        attendanceTaken = 1
        res.render('attendance',{
            event
        })
    }catch(err){
        req.flash('error_msg', 'Unable to get attendance page')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to save attendance
router.post('/event/present/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to mark present')
            return res.redirect('/event/attendance/' + req.params.eid)
        }
        event.present = event.present.concat(Object.values(req.body))
        await event.save()
        res.redirect('/event/attendance/' + req.params.eid)
    }catch(err){
        req.flash('error_msg', 'Unable mark present')
        res.redirect('/event/present/' + req.params.eid)
        console.log(err)
    }
})

//delete event
router.get('/event/delete/:eid', checkAuth, async (req, res)=>{
    try{
        const event = await Event.findOne({_id: req.params.eid, owner: req.user._id})
        if(!event){
            req.flash('error_msg', 'Unable to delete event')
            return res.redirect('/dashboard')
        }
        await event.remove()
        res.redirect('/dashboard')
    }catch(err){
        req.flash('error_msg', 'Unable to delete this event')
        res.redirect('/dashboard')
        console.log(err)
    }
})

module.exports = router