var express = require('express');
var router = express.Router();
var Comment = require('../models/Comments');
var Event = require('../models/Events');

//add comment
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  req.body.eventId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect('back');
      }
    );
  });
});
//comment like
router.get('/likes/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
    (err, comment) => {
      if (err) return next(err);
      res.redirect('back');
    }
  );
});
//comment edit
router.get('/edit/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render('editComment', { comment });
  });
});
//comment post
router.post('/edit/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, { new: true }, (err, comment) => {
    if (err) return next(err);
    res.redirect('/events/' + comment.eventId);
  });
});
//delete comment
router.get('/delete/:id', (req, res, next) => {
  var commentId = req.params.id;
  Comment.findByIdAndDelete(commentId, (err, delComment) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      delComment.eventId,
      { $pull: { comments: commentId } },
      { new: true },
      (err, event) => {
        if (err) return next(err);
        res.redirect('back');
      }
    );
  });
});
module.exports = router;
