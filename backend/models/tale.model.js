// backend/models/tale.model.js
import mongoose from "mongoose";

const taleSchema = new mongoose.Schema({

		title: {
		  type: String,
		  required: true,
		},
		content: {
		  type: String,
		  required: true,
		},
		author: {
		  type: String,
		  required: true,
		},
		authortype: {
		  type: String,
		  required: true,
		},
		visibility: {
		  type: String,
		  required: true,
		},
		likes: [
			{
			  username: String,
			  timestamp: {
				type: Date,
				default: Date.now,
			  },
			},
		  ],		
	comments: [
		{
		  commenter: String,
		  text: String,
		  timestamp: {
			type: Date,
			default: Date.now,
		  },
		},
	  ],
  }, {
	timestamps: true,
  });

const Tale = mongoose.model("Tale", taleSchema);

export default Tale;