const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const connectDB = require("./db")
const todoRoutes = require("./routes/todoRoutes")
const { GoogleGenerativeAI } =require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
dotenv.config()

const app = express();

/*
// Or enable CORS for a specific origin
app.use(cors({
    origin: 'https://frontend.com'
*/

//enable cors for all origins
app.use(cors({
    origin: "http://localhost:3000", // Allow only this origin
}))
app.use(bodyParser.json())
// Parse incoming JSON data
app.use(express.json())
app.use('/api', todoRoutes)

connectDB()


module.exports = app;
// app.use()