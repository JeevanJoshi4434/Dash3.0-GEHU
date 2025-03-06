const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello Mommy");
});

const generate = async (prompt) => {
    try {
        const modifiedPrompt = `Provide a 50-word response related to maternal and child healthcare:\n\n${prompt}`;
        const result = await model.generateContent(modifiedPrompt);
        return result.response.text().split(" ").slice(0, 50).join(" ");
    } catch (err) {
        console.log(err);
        return "Error processing request.";
    }
};

app.post("/api/content", async (req, res) => {
    try {
        const data = req.body.question;
        if (!data) {
            return res.status(400).json({ error: "Question parameter is required" });
        }
        const result = await generate(data);
        res.json({ result: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// New API for Maternal Diet Plan
app.post("/api/diet-plan", async (req, res) => {
    try {
        const {
            weight, height, hemoglobin, bloodPressure,
            pregnancyWeeks, complications, dietPreference,
            foodAllergies, incomeLevel, foodAvailability, activityLevel
        } = req.body;

        if (!weight || !height || !hemoglobin || !bloodPressure || !pregnancyWeeks || !dietPreference || !activityLevel) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const prompt = `Generate a maternal next 1 week diet plan based on the following details for break fast lunch and dinner include fruits and veg table if required include for in just 50 words in hindi :\n
        Weight: ${weight} kg, Height: ${height} cm, Hemoglobin: ${hemoglobin} g/dL, Blood Pressure: ${bloodPressure}\n
        Pregnancy Weeks: ${pregnancyWeeks}, Complications: ${complications},\n
        Diet Preference: ${dietPreference}, Food Allergies: ${foodAllergies},\n
        Income Level: ${incomeLevel}, Food Availability: ${foodAvailability},\n
        Physical Activity Level: ${activityLevel}\n
        Provide a balanced meal plan for breakfast, lunch, and dinner.`;

        const result = await model.generateContent(prompt);
        res.json({ dietPlan: result.response.text() });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
