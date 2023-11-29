
const express = require ("express");
const { signUpUser, loginUser, logOutUser, followUnFollowUser } = require ("../controllers/userController");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logOut", logOutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);  // Toggle State( Follow/Unfollow)

module.exports = router;