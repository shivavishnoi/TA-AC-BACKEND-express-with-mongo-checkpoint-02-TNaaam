var express = require('express');
var router = express.Router();
var Event = require('../models/Events');
var Comment = require('../models/Comments');
var moment = require('moment');
/* GET users listing. */
//registration page
router.get('/new', function (req, res, next) {
  res.render('newEvent');
});

//capture data
router.post('/new', (req, res, next) => {
  req.body.category = req.body.category.split(' ');
  Event.create(req.body, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/all');
  });
});
// get all events list
router.get('/all', (req, res, next) => {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    events.forEach((event) => {
      event.startDate = moment(event.start_date).format('DD - MM - YYYY');
    });
    res.render('allEvents', { events });
  });
});
// update like
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
    (err, event) => {
      if (err) return next(err);
      res.redirect('back');
    }
  );
});
//filter by latest date
router.get('/latest', (req, res, next) => {
  Event.find({})
    .sort({ start_date: 1 })
    .exec((err, events) => {
      if (err) return next(err);
      events.forEach((event) => {
        event.startDate = moment(event.start_date).format('DD - MM - YYYY');
      });
      res.render('allEvents', { events });
    });
});
//filter by location
router.get('/location', (req, res, next) => {
  Event.find({})
    .sort('location')
    .exec((err, events) => {
      if (err) return next(err);
      events.forEach((event) => {
        event.startDate = moment(event.start_date).format('DD - MM - YYYY');
      });
      res.render('allEvents', { events });
    });
});
//show details
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id)
    .populate('comments')
    .exec((err, event) => {
      if (err) return next(err);
      event.startDate = moment(event.start_date).format('DD-MM-YYYY');
      event.endDate = moment(event.end_date).format('DD - MM-YYYY');

      res.render('eventDetails', { event });
    });
  // Event.findById(id, (err, event) => {
  // });
});
//delete event
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, delEvent) => {
    if (err) return next(err);
    Comment.deleteMany({ eventId: id }, (err, delComment) => {
      if (err) return next(err);
      res.redirect('/events/all');
    });
  });
});
//edit event
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) return next(err);
    res.render('editEvent', { event });
  });
});
router.post('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, { new: true }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + event._id);
  });
});
module.exports = router;
