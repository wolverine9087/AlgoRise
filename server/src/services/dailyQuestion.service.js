import { groqJSON } from "./groq.service.js";

const levels = new Set(["EASY", "MEDIUM", "HARD"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function generateDailyQuestions({ count, topicPerformance = {}, avoidSlugs = [] }) {
  const questions = [];
  const used = new Set(avoidSlugs.filter((slug) => slugPattern.test(slug)));
  const avoided = [...used];

  while (questions.length < count) {
    const batchSize = Math.min(8, count - questions.length);
    const result = await groqJSON({
      temperature: 0.35,
      maxCompletionTokens: 4096,
      system: "You select real, established LeetCode DSA problems for a learner's practice set. Return JSON only in the shape {questions:[{title,slug,topic,difficulty}]}. Give the official LeetCode problem title and exact URL slug for each item. Use only existing, well-known LeetCode problems. Never invent a problem, slug, prompt, description, or solution. Do not return statements or explanations. Topics should be concise standard DSA categories such as Arrays & Hashing, Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming, Stack, Binary Search, Linked List, Heap, Backtracking, Intervals, or Bit Manipulation. Difficulty must be EASY, MEDIUM, or HARD.",
      prompt: JSON.stringify({
        task: "Create the next batch of distinct existing DSA problems for this learner.",
        count: batchSize,
        topicPerformance,
        avoidSlugs: avoided,
        rules: [
          "Give extra questions from topics with fewer successful solves or more review outcomes.",
          "Give fewer questions from topics with at least two successful solves.",
          "Do not reuse any avoided slug.",
          "Return exactly the requested number of real LeetCode problems.",
        ],
      }),
    });
    if (!Array.isArray(result.questions)) throw Object.assign(new Error("AI returned no question list"), { statusCode: 502 });
    let added = 0;
    for (const item of result.questions) {
      const slug = String(item.slug || "").toLowerCase();
      const difficulty = String(item.difficulty || "").toUpperCase();
      if (!item.title || !item.topic || !slugPattern.test(slug) || !levels.has(difficulty) || used.has(slug)) continue;
      used.add(slug);
      avoided.push(slug);
      questions.push({
        id: slug,
        title: String(item.title).trim(),
        topic: String(item.topic).trim(),
        difficulty,
        url: `https://leetcode.com/problems/${slug}/`,
      });
      added += 1;
      if (questions.length === count) break;
    }
    if (!added) throw Object.assign(new Error("AI could not return enough new valid LeetCode questions. Generate another set to retry."), { statusCode: 502 });
  }

  return questions;
}
