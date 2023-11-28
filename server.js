import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";


dotenv.config()

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({limit : "50mb"}))  // Parse json data inside the req body;
app.use(express.urlencoded({extended: true}))  // Parse form data inside the req body;
app.use(cookieParser())


app.get("/", (req,res) => {
    res.send("Welcome Home 🏠")
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => console.log(`Server Is Running On PORT ${PORT}`));

}).catch((err) => console.log(err))