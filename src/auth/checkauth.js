const passport = require('passport')
const User = require('../models/user.js')

const checkAuth = async (req, res, next)=>{
    if(req.isAuthenticated()){
        res.locals.notificationCount = req.user.notificationCount()
        res.locals.myself = req.user
        return next()
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login')
}

const checkNotAuth = (req, res, next)=>{
    if(req.isAuthenticated){
        return res.redirect('/dashboard')
    }
    return next()
}

module.exports = {
    checkAuth,
    checkNotAuth
}