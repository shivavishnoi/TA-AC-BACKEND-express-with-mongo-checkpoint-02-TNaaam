var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    host: { type: String, required: true },
    start_date: { type: Date, require: true },
    end_date: { type: Date, require: true },
    category: { type: [String], required: true },
    location: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  },
  { timestamps: true }
);

var Event = mongoose.model('Event', eventsSchema);
module.exports = Event;
