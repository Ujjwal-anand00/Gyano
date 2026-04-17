const generateAIResponse = require("../services/aiService").generateAIResponse;
const cache = require("../utils/cache");

const askAI = async (req, res) => {
  try {
    let { question, lessonContent } = req.body;

    // ✅ Validation
    if (!question || !lessonContent) {
      return res.status(400).json({
        success: false,
        message: "Question and lesson content required",
      });
    }

    question = question.trim();
    lessonContent = lessonContent.trim();

    // ✅ Limit size (VERY IMPORTANT)
    if (lessonContent.length > 2000) {
      lessonContent = lessonContent.substring(0, 2000);
    }

    if (question.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Question too long",
      });
    }

    // ✅ Cache key
    const cacheKey = `${question}-${lessonContent.slice(0, 100)}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        answer: cached,
        cached: true,
      });
    }

    // ✅ Controlled prompt
    const prompt = `
You are an expert teacher. Answer ONLY based on the lesson content below.

If the answer is not present in the lesson, say:
"I cannot find this in the lesson."

Lesson Content:
${lessonContent}

Question:
${question}
`;

    const answer = await generateAIResponse(prompt);

    // ✅ Save to cache
    cache.set(cacheKey, answer);

    res.json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI failed",
    });
  }
};

module.exports = askAI;