const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const Event = require("../models/event.js");
const { checkAuth, checkNotAuth } = require("../auth/checkauth.js");

const router = new express.Router();

router.get("/", (req, res) => {
  res.redirect("/signup");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    req.flash("success_msg", "you are now registered and can login");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    if (err.keyValue.email) {
      req.flash("error_msg", "Email is already in use");
    } else if (err.keyValue.name) {
      req.flash("error_msg", "Name is already in use");
    } else {
      req.flash("error_msg", "Sorry! Unable to register");
    }
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(req.session.returnTo || "/dashboard");
    delete req.session.returnTo;
  }
);

//dashboard page
router.get("/dashboard", checkAuth, async (req, res) => {
  await req.user.populate("event").execPopulate();
  let acceptedEvents = [];
  for (var i = 0; i < req.user.accepted.length; i++) {
    var event = await Event.findById(req.user.accepted[i]);
    acceptedEvents = acceptedEvents.concat(event);
  }
  res.render("dashboard", {
    myself: req.user,
    acceptedEvents,
  });
});

//notification page
router.get("/notification", checkAuth, async (req, res) => {
  try {
    let notification = [];

    for (let k = 0; k < req.user.invitationGot.length; k++) {
      var event = await Event.findOne({ _id: req.user.invitationGot[k] });
      if (!event) {
        throw new Error();
      }
      await event.populate("owner").execPopulate();
      notification = notification.concat({
        username: event.owner.name,
        eventTitle: event.title,
        eid: event._id,
        type: "invited",
      });
    }
    await req.user.populate("event").execPopulate();

    for (let l = 0; l < req.user.event.length; l++) {
      req.user.event[l].usersAccept.forEach((name) => {
        notification = notification.concat({
          username: name,
          eventTitle: req.user.event[l].title,
          type: "accepted",
        });
      });
    }
    req.user.unseenEventAccepted = [];
    req.user.unseenInvitation = [];
    await req.user.save();
    notification.reverse();
    res.render("notification", {
      myself: req.user,
      notification,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get notifications");
    res.redirect("/dashboard");
    console.log(err);
  }
});

//other users profile
router.get("/profile/:uname", checkAuth, async (req, res) => {
  try {
    const otherUser = await User.findOne({ name: req.params.uname });
    if (!otherUser) {
      req.flash("error_msg", "Unable to get user");
      res.redirect("/dashboard");
      return console.log("there is no such user");
    }
    res.render("otherProfile", {
      myself: req.user,
      otherUser,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get user");
    res.redirect("/dashboard");
    console.log(err);
  }
});

//own profile
router.get("/me/profile", checkAuth, async (req, res) => {
  try {
    // await req.user.populate('article').execPopulate()
    const events = await Event.find({ owner: req.user._id });
    const eventsCreated = events.length;
    res.render("myProfile", {
      eventsCreated,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get profile");
    res.redirect("/dashboard");
    console.log(err);
  }
});

router.get("/logout", checkAuth, (req, res) => {
  try {
    delete req.session.returnTo;
    req.logout();
    res.redirect("/login");
  } catch (err) {
    req.flash("error_msg", "Unable to logout");
    res.redirect("/dashboard");
  }
});

module.exports = router;
