const { google } = require("googleapis");
const express = require("express");
const { OAuth2 } = google.auth;
const Event = require("../models/event.js");
const { checkAuth, checkNotAuth } = require("../auth/checkauth.js");

const router = new express.Router();

const OAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

let calendarEvent;

router.get("/addEvent/:eid", checkAuth, async (req, res) => {
  const event = await Event.findOne({ _id: req.params.eid });

  if (!event) {
    req.flash("error_msg", "unable to find the requested event");
    res.redirect("/dashboard");
    return;
  }

  let eventEndTime = new Date(event.datetime);
  eventEndTime.setHours(eventEndTime.getHours() + 1);

  calendarEvent = {
    summary: event.title,
    location: "",
    description: "invitation",
    start: {
      dateTime: event.datetime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: eventEndTime,
      timeZone: "Asia/Kolkata",
    },
  };

  const authUrl = OAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

//redirect uri which will contain information sent by google calendar(code for token)
router.get("/google", checkAuth, (req, res) => {
  OAuth2Client.getToken(req.query.code, async (err, token) => {
    if (err) {
      req.flash("error_msg", "Error retrieving access token");
      res.redirect("/dashboard");
      return console.error("Error retrieving access token", err);
    }
    OAuth2Client.setCredentials(token);
    await start(req, res);
  });
});

const calendar = google.calendar({
  version: "v3",
  auth: OAuth2Client,
});

//to create event
function start(req, res) {
  calendar.events.insert(
    {
      auth: OAuth2Client,
      calendarId: "primary",
      resource: calendarEvent,
    },
    function (err, event) {
      if (err) {
        req.flash(
          "error_msg",
          "There was an error contacting the Calendar service"
        );
        res.redirect("/dashboard");
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      req.flash("success_msg", "event added to google calendar successfully");
      res.redirect("/dashboard");
    }
  );
}

module.exports = router;
