const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    imageurl: {
      type: String,
      require: false,
    },
    zipurl: {
      type: String,
      require: false,
    },
    name: {
      // name of the author
      type: String,
      require: true,
    },
    willLearn: {
      type: String,
      require: false,
    },
    discription: {
      type: String,
      require: true,
    },
    discriptionLong: {
      type: String,
      require: false,
    },
    requirement: {
      type: String,
      require: false,
    },
    creator: {
      type: Schema.Types.ObjectId, //for refrencing the person who created it
      required: true,
      ref: "User",
    },
    bookmark: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],

    YoutubeVideo: {
      type: String,
      require: false,
    },

    Duration: {
      type: String,
      require: false,
    },

    videoContent: [
      {
        videotitle: {
          type: String,
          required: false,
        },
        videoUrl: {
          type: String,
          required: false,
        },
        usersWatched: [
          {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "User",
          },
        ],
      },
    ],

    courseCompleted: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],

    ongoingInformation: [
      {
        userid: {
          type: Schema.Types.ObjectId,
          required: false,
          ref: "User",
        },
        progress: {
          type: String,
          required: false,
        },
        username: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: false,
        },
      },
    ],

    rating: {
      ratingSum: {
        type: Number,
        required: false,
        default: 1,
      },
      timesUpdated: {
        type: Number,
        require: false,
        default: 1,
      },
      ratingFinal: {
        type: Number,
        require: false,
        default: 1,
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
