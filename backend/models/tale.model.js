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
		genre: {
			type: String,
			required: true,
			default: 'unknown', // optional default
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
		  roses: {
			tomato: [String],
			low: [String],
			'mid-low': [String],
			mid: [String],
			'mid-high': [String],
			high: [String],
		  },				  
	comments: [
		{
		  commenter: String,
		  text: String,
    	guestauthor: { type: String, default: null },
		  timestamp: {
			type: Date,
			default: Date.now,
		  },
		},
	  ],
	  guestcomments: [
		{	
			commenter: { 
			type: String, 
			default: null },
			guestauthor: { 
			type: String, 
			default: null },
		  guestId: {
			type: String,
			required: true,
		  },
		  emoji: {
			type: String,
			default: '👤',
		  },
		  text: {
			type: String,
			required: true,
		  },
		  timestamp: {
			type: Date,
			default: Date.now,
		  },
		},
	  ],
	  receipt: {
		type: String,
		default: null
	  },	  
	  	  
  }, {
	timestamps: true,
  });

const Tale = mongoose.model("Tale", taleSchema);

export default Tale;