// backend/controllers/tale.controller.js
import mongoose from "mongoose";
import Tale from "../models/tale.model.js";



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
	const tale = req.body; // user will send this data

	if (!tale.title || !tale.content || !tale.author || !tale.authortype || !tale.visibility) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newTale = new Tale(tale);

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
  
	try {
	  const tale = await Tale.findById(taleId);
	  if (!tale) return res.status(404).json({ message: 'Tale not found' });
  
	  tale.comments.push({ commenter, text });
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
  