const path = require('path')
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const ejs = require('ejs')

//connecting to datatbase
require('./src/db/mongoose.js')

// intializing passport
const intialize = require('./src/auth/auth.js')
intialize(passport)

const app = express()

//routers
const userRouter = require('./src/routers/user.js')
const eventRouter = require('./src/routers/event.js')
const inviteRouter = require('./src/routers/invite.js')
const customRouter = require('./src/routers/custom.js')
const calendarRouter = require('./src/google-calendar/calendar.js')

app.set('view engine', 'ejs')

//middlewares
app.use(express.static(path.join(__dirname, './public')))
// app.use(express.json())
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//declaring global variables for flash
app.use((req, res, next)=>{
    res.locals.error_msg = req.flash('error_msg')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use(userRouter)
app.use(eventRouter)
app.use(inviteRouter)
app.use(customRouter)
app.use(calendarRouter)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log('server is up on port ' + PORT)
})