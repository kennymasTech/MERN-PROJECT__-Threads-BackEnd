
const express = require ("express");
const { signUpUser, loginUser, logoutUser, followUnFollowUser } = require ("../controllers/userController");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);  // Toggle State( Follow/Unfollow)

module.exports = router;