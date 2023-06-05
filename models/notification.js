const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: ['LIKE', 'NEW_COMMENT', 'NEW_VIDEO_ADDED'],
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    targetId: { //user elli mch tousolou notification
        type: Schema.Types.ObjectId, ref: "User"
    },
    sourceId: { //user elli b3ath notification
        type: Schema.Types.ObjectId, ref: "User"
    },
    isRead: {
        type: Boolean, default: false
    },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;