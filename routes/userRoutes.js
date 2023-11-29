
const express = require ("express");
const { signUpUser, loginUser, logOutUser } = require ("../controllers/userController");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logOut", logOutUser);

module.exports = router;