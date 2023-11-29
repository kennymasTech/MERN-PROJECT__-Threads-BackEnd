const Jwt = require ("jsonwebtoken");

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) return res.status(401).json({ message: "Unauthorized"});

        const decoded = Jwt.verify(token, process.env.JWT_SECRET)

        const user = await user.findById(decoded.userId).select("-password")

        req.user = user

        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error While Signing Up User:", error.message);
    }
}

module.exports = protectRoute