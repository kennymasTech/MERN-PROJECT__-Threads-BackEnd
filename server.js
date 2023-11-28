import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config()

const PORT = process.env.PORT || 5000;

app.use(express.json({limit : "50mb"}))  // Parse json data inside the req body;
app.use(express.urlencoded({extended: true}))  // Parse form data inside the req body;
app.use(cookieParser())
