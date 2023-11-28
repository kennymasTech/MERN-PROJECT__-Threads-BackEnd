import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config()
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({limit : "50mb"}))  // Parse json data inside the req body;
app.use(express.urlencoded({extended: true}))  // Parse form data inside the req body;
app.use(cookieParser())


app.get("/", (req,res) => {
    res.send("Welcome Home 🏠")
})

app.listen(PORT, () => console.log(`Server Running On PORT ${PORT}`));