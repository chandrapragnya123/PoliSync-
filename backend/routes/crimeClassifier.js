const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

router.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const prompt = `Hey there is a user who is sending a request to file an FIR to the police and has encountered a situation. Their complaint is: "${text}". Now help me classify the type of crime that has been committed in this case. Please respond with just one word (like: harassment, theft, assault, attack, terror, bomb, abuse, etc.), all in lowercase, with no punctuation or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response; // <-- fix here

    const textResponse = await response.text(); // <-- properly get text from response
    console.log('Gemini response:', textResponse);

    const crimeType = textResponse.trim().toLowerCase().split(/\s+/)[0];

    res.json({ crimeType });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Internal server error during classification' });
  }
});

module.exports = router;
