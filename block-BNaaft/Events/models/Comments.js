var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
var Comment = mongoose.model('Comment', commentsSchema);
module.exports = Comment;
