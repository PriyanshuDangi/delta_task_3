const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user.js')
const Event = require('../models/event.js')
const {checkAuth, checkNotAuth} = require('../auth/checkauth.js')

const router = new express.Router()

//to create a new blank event
router.get('/event/create/blank', checkAuth, async (req, res)=>{
    try{
        const event = new Event({
            owner: req.user._id
        })
        await event.save()
        res.redirect('/event/edit/' + event._id)
    }catch(err){
        req.flash('error_msg', 'unable to create event')
        res.redirect('/event/create')
        console.log(err)
    }
})

//to create a new birthday event
router.get('/event/create/birthday', checkAuth, async (req, res)=>{
    try{
        const event = new Event({
            title: 'birthday invitation',
            header : "<div style=\"text-align: center;\"><font size=\"7\" color=\"#ff0000\">Dev's BirthDay</font><font size=\"7\" color=\"#00bfff\">&nbsp;</font></div>",
            content : "<div style=\"text-align: center;\"><font size=\"5\">You are cordially invited for</font></div><div style=\"text-align: center;\"><font size=\"5\"><br></font></div><div style=\"text-align: center;\"><font size=\"7\" color=\"#ff4500\" face=\"typeface\"><b><i>Dev's 15th</i></b></font></div><div style=\"text-align: center;\"><font size=\"7\" color=\"#ff4500\" face=\"typeface\"><b><i>Birthday Party</i></b></font></div><div style=\"text-align: center;\"><br></div><div style=\"text-align: center;\"><font size=\"5\" face=\"black\"><b style=\"\"><i style=\"\">December 02, 2020</i></b></font></div><div style=\"text-align: center;\"><font size=\"5\" face=\"black\"><b><i>3:00 PM</i></b></font></div><div style=\"text-align: center;\"><font size=\"5\" face=\"black\"><b style=\"\"><i style=\"\">NIT Trichy</i></b></font></div>",
            footer : "<div style=\"text-align: center;\"><i style=\"\"><font face=\"contrast\"><b>We Hope To See You There</b></font></i></div>",
            datetime : "2020-12-02T15:00",
            owner: req.user._id
        })
        await event.save()
        res.redirect('/event/edit/' + event._id)
    }catch(err){
        req.flash('error_msg', 'unable to create event')
        res.redirect('/event/create')
        console.log(err)
    }
})

//to create a new wedding event
router.get('/event/create/wedding', checkAuth, async (req, res)=>{
    try{
        const event = new Event({
            title: "wedding invitation",
            header : "<div style=\"text-align: center;\"><span style=\"font-size: 1.2rem;\"><b><i><font face=\"lato\">JOIN US FOR THE</font></i></b></span></div>",
            content : "<div style=\"text-align: center; \"><font size=\"7\" color=\"#c5b358\" face=\"typepace\">Wedding</font></div><div style=\"text-align: center;\"><font size=\"7\" color=\"#c5b358\" face=\"typepace\">Of</font></div><div style=\"text-align: center;\"><font size=\"6\" color=\"#a9a9a9\"><b>ANDREA LUCAS</b></font></div><div style=\"text-align: center;\"><font size=\"7\" color=\"#c5b358\" face=\"typeface\">And</font></div><div style=\"text-align: center;\"><font size=\"6\" color=\"#a9a9a9\"><b>BRYAN TAYLOR</b></font></div><div style=\"text-align: center;\"><font size=\"6\"><b><br></b></font></div><div style=\"text-align: center;\"><i>FRIDAY, JULY 15, 2020</i></div><div style=\"text-align: center;\"><i>AT SIX O'CLOCK IN THE EVENING&nbsp;</i></div><div style=\"text-align: center;\"><i>TRICHY, INDIA</i></div><div style=\"text-align: center;\"><br></div>",
            footer : "<div><br></div><div style=\"text-align: center;\"><i><b><font face=\"typeface\">Reception To Follow</font></b></i></div>",owner: req.user._id,
            datetime : "2020-07-15T18:00",
            owner: req.user._id
        })
        await event.save()
        res.redirect('/event/edit/' + event._id)
    }catch(err){
        req.flash('error_msg', 'unable to create event')
        res.redirect('/event/create')
        console.log(err)
    }
})

//to create a new wedding event
router.get('/event/create/funeral', checkAuth, async (req, res)=>{
    try{
        const event = new Event({
            title: "funeral",
            header : "<div style=\"text-align: center;\"><span style=\"font-size: 1.2rem;\"><b><font face=\"serif\">In Kind and Loving Memory</font></b></span></div>",
            content : "<div style=\"text-align: center;\"><font color=\"#a13d2d\" style=\"\" size=\"7\">MEREDITH KANEGI</font><br></div><div style=\"text-align: center;\"><font size=\"7\" color=\"#a13d2d\">1942-2020</font></div><div style=\"text-align: center;\"><br></div><div style=\"text-align: center;\"><i><b>Funeral on April 1 , 3 PM</b></i></div><div style=\"text-align: center;\"><i><b>Holy Grace Chapel A</b></i></div><div style=\"text-align: center;\"><br></div><div style=\"text-align: center;\"><i>The Kanegis appreciate your sympathy.<span style=\"font-size: 1.2rem;\">&nbsp;</span></i></div>",
            footer : "<div style=\"text-align: center;\"><span style=\"font-size: 1.2rem;\"><b><i>May she rest in peace.</i></b></span></div>",
            datetime : "2020-04-01T15:00",
            owner: req.user._id
            })
        await event.save()
        res.redirect('/event/edit/' + event._id)
    }catch(err){
        req.flash('error_msg', 'unable to create event')
        res.redirect('/event/create')
        console.log(err)
    }
})


module.exports = router