
const express = require('express');
const { createPost } = require('../controllers/postControllers');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

router.post("/create", createPost, protectRoute)

module.exports = router;