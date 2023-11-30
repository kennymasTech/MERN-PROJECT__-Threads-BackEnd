
const express = require('express');
const { createPost, getPost, deletePost } = require('../controllers/postControllers');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

router.get("/:id", getPost)
router.post("/create", createPost, protectRoute)
router.delete("/:id", deletePost)

module.exports = router;