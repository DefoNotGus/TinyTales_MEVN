// backend/controllers/tale.controller.js
import mongoose from "mongoose";
import Tale from "../models/tale.model.js";
import { isProfane } from '../utils/profanity.js';

export const getTales = async (req, res) => {
	try {
		const tales = await Tale.find({});
		res.status(200).json({ success: true, data: tales });
	} catch (error) {
		console.log("error in fetching tales:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createTale = async (req, res) => {
	const { title, content, author, authortype, visibility, genre, receipt } = req.body;
  
	if (!title || !content || !visibility || (!author && !receipt)) {
	  return res.status(400).json({ success: false, message: "Missing required fields" });
	}

	if (isProfane(`${title} ${content}`)) {
		return res.status(400).json({
		  success: false,
		  message: "🚫 Please remove offensive language from your tale."
		});
	  }

	// If guest (no author), genre and receipt must exist
	if (!author && (!genre || !receipt)) {
	  return res.status(400).json({ success: false, message: "Guest submission must include genre and receipt." });
	}

	const newTale = new Tale({
	  title,
	  content,
	  author: author || '👻Guest',
	  authortype: authortype || 'ghost',
	  visibility,
	  genre: genre || 'unknown',
	  receipt: receipt || null
	});


	  
	try {
	  await newTale.save();
	  res.status(201).json({ success: true, data: newTale });
	} catch (error) {
	  console.error("Error in Create Tale:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };
  

  export const updateTale = async (req, res) => {
	const { id } = req.params;
	const tale = req.body;
  
	if (!mongoose.Types.ObjectId.isValid(id)) {
	  return res.status(404).json({ success: false, message: "Invalid Tale Id" });
	}
  
	// ✅ Fix: Access properties from `tale`
	if (isProfane(`${tale.title} ${tale.content}`)) {
	  return res.status(400).json({
		success: false,
		message: "🚫 Please remove offensive language from your tale."
	  });
	}
  
	try {
	  const updatedTale = await Tale.findByIdAndUpdate(id, tale, { new: true });
	  res.status(200).json({ success: true, data: updatedTale });
	} catch (error) {
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };
  
  

export const deleteTale = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Tale Id" });
	}

	try {
		await Tale.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Tale deleted" });
	} catch (error) {
		console.log("error in deleting the tale:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getTaleById = async (req, res) => {
	const { id } = req.params;
  
	if (!mongoose.Types.ObjectId.isValid(id)) {
	  return res.status(404).json({ success: false, message: "Invalid Tale Id" });
	}
  
	try {
	  const tale = await Tale.findById(id);
	  if (!tale) {
		return res.status(404).json({ success: false, message: "Tale not found" });
	  }
  
	  res.status(200).json({ success: true, data: tale });
	} catch (error) {
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };

// likeTale
export const likeTale = async (req, res) => {
	const { username } = req.body; // From frontend
  
	if (!username) {
	  return res.status(400).json({ message: 'Username is required' });
	}
  
	try {
	  const tale = await Tale.findById(req.params.id);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  const existingIndex = tale.likes.findIndex(like => like.username === username);
  
	  if (existingIndex > -1) {
		// 👎 Already liked → remove like
		tale.likes.splice(existingIndex, 1);
	  } else {
		// 👍 Not liked yet → add like
		tale.likes.push({ username, timestamp: new Date() });
	  }
  
	  await tale.save();
	  res.status(200).json({ message: 'Like toggled', likes: tale.likes });
	} catch (err) {
	  res.status(500).json({ message: 'Failed to toggle like', error: err.message });
	}
  };
  
 // comments
export const addComment = async (req, res) => {
	const { taleId } = req.params;
	const { commenter, text } = req.body;

/*	
		Comment filtering

		if (isProfane(text)) {
				return res.status(400).json({ message: "🚫 Please remove offensive language." });
			}
*/  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  tale.comments.push({
		commenter,
		text,
		guestauthor: req.body.guestauthor || null
	  });
	  
	  await tale.save();
  
	  res.status(200).json({ message: 'Comment added', tale });
	} catch (err) {
	  res.status(500).json({ message: 'Error adding comment', error: err.message });
	}
  };
  
  export const getCommentsForTale = async (req, res) => {
	const { taleId } = req.params;
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  res.status(200).json({ comments: tale.comments });
	} catch (err) {
	  res.status(500).json({ message: 'Failed to retrieve comments', error: err.message });
	}
  };
  
  export const deleteComment = async (req, res) => {
	const { taleId, commentId } = req.params;
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ success: false, message: "Tale not found" });
  
	  tale.comments = tale.comments.filter(comment => comment._id.toString() !== commentId);
	  await tale.save();
  
	  res.json({ success: true, message: "Comment deleted", data: tale });
	} catch (error) {
	  console.error("Error deleting comment:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };
  

  // 🌹 Add or update a rose rating
export const addRoseRating = async (req, res) => {
	const { id } = req.params; // Tale ID
	const { username, rating } = req.body; // rating = 'low' | 'mid' | ... | 'tomato'
  
	const validRatings = ['tomato', 'low', 'mid-low', 'mid', 'mid-high', 'high'];
	if (!validRatings.includes(rating)) {
	  return res.status(400).json({ success: false, message: 'Invalid rating tier.' });
	}
  
	try {
	  const tale = await Tale.findById(id);
	  if (!tale) return res.status(404).json({ success: false, message: 'Tale not found.' });
  
	  // Remove username from all tiers
	  validRatings.forEach(tier => {
		tale.roses[tier] = tale.roses[tier].filter(user => user !== username);
	  });
  
	  // Add to the selected tier
	  tale.roses[rating].push(username);
	  await tale.save();
  
	  res.json({ success: true, message: 'Rose rating added/updated', data: tale.roses });
	} catch (err) {
	  console.error('Error adding rose rating:', err.message);
	  res.status(500).json({ success: false, message: 'Server error' });
	}
  };
  
  // 🌹 Remove a user's rose rating
  export const removeRoseRating = async (req, res) => {
	const { id } = req.params;
	const { username } = req.body;
  
	try {
	  const tale = await Tale.findById(id);
	  if (!tale) return res.status(404).json({ success: false, message: 'Tale not found.' });
  
	  // Remove from all tiers
	  ['tomato', 'low', 'mid-low', 'mid', 'mid-high', 'high'].forEach(tier => {
		tale.roses[tier] = tale.roses[tier].filter(user => user !== username);
	  });
  
	  await tale.save();
	  res.json({ success: true, message: 'Rose rating removed', data: tale.roses });
	} catch (err) {
	  console.error('Error removing rose rating:', err.message);
	  res.status(500).json({ success: false, message: 'Server error' });
	}
  };
  
  // 🌹 Get all rose rating data for a tale
  export const getRoseRatings = async (req, res) => {
	const { id } = req.params;
  
	try {
	  const tale = await Tale.findById(id);
	  if (!tale) return res.status(404).json({ success: false, message: 'Tale not found.' });
  
	  const ratingCounts = {};
	  let total = 0;
	  let weightedSum = 0;
  
	  const ratingWeights = {
		tomato: 0,
		low: 1,
		'mid-low': 2,
		mid: 3,
		'mid-high': 4,
		high: 5,
	  };
  
	  for (const [tier, users] of Object.entries(tale.roses)) {
		const count = users.length;
		ratingCounts[tier] = count;
		total += count;
		weightedSum += count * ratingWeights[tier];
	  }
  
	  const average = total ? (weightedSum / total).toFixed(2) : null;
  
	  res.json({
		success: true,
		data: {
		  counts: ratingCounts,
		  total,
		  average,
		  details: tale.roses,
		},
	  });
	} catch (err) {
	  console.error('Error fetching rose ratings:', err.message);
	  res.status(500).json({ success: false, message: 'Server error' });
	}
  };
  

  // Guest comments
  export const addGuestComment = async (req, res) => {
	const { taleId } = req.params;
	const { guestId, emoji, text } = req.body;
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  tale.guestcomments.push({ guestId, emoji, text });
	  await tale.save();
  
	  res.status(200).json({ message: 'Guest comment added', tale });
	} catch (err) {
	  res.status(500).json({ message: 'Error adding guest comment', error: err.message });
	}
  };
  
  export const getGuestCommentsForTale = async (req, res) => {
	const { taleId } = req.params;
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  res.status(200).json({ guestcomments: tale.guestcomments });
	} catch (err) {
	  res.status(500).json({ message: 'Failed to retrieve guest comments', error: err.message });
	}
  };
  
  export const deleteGuestComment = async (req, res) => {
	const { taleId, commentId } = req.params;
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) {
		return res.status(404).json({ success: false, message: "Tale not found" });
	  }
  
	  const initialCount = tale.guestcomments.length;
	  tale.guestcomments = tale.guestcomments.filter(comment => comment._id.toString() !== commentId);
  
	  if (tale.guestcomments.length === initialCount) {
		return res.status(404).json({ success: false, message: "Guest comment not found" });
	  }
  
	  await tale.save();
	  res.json({ success: true, message: "Guest comment deleted", data: tale });
	} catch (error) {
	  console.error("Error deleting guest comment:", error.message);
	  res.status(500).json({ success: false, message: "Server error", error: error.message });
	}
  };
  
  export const claimGuestComments = async (req, res) => {
	const { guestId, emoji } = req.body;
	const username = req.user.username;
  
	try {
	  const tale = await Tale.findById(req.params.id);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  let updated = false;
	  const updatedGuestComments = tale.guestcomments.map(comment => {
		if (
		  comment.guestId === guestId &&
		  comment.emoji === emoji &&
		  !comment.commenter
		) {
		  updated = true;
		  return { ...comment.toObject(), commenter: username };
		}
		return comment;
	  });
  
	  if (!updated) {
		return res.status(200).json({ message: 'No comments matched.', data: tale });
	  }
  
	  tale.guestcomments = updatedGuestComments;
	  await tale.save();
  
	  res.json({ success: true, message: 'Comments claimed!', data: tale });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Server error' });
	}
  };
  