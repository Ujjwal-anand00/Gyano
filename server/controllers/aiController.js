const generateAIResponse = require("../services/aiService").generateAIResponse;

const askAI = async (req, res) => {
  try {
    const { question, lessonContent } = req.body;

    const prompt = `
    Lesson Content:
    ${lessonContent}

    Question:
    ${question}
    `;

    const answer = await generateAIResponse(prompt);

    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI failed" });
  }
};

module.exports = askAI;