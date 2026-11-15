import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { questionApi } from "../services/api";
import { useAuth } from "./AuthContext";

// Context and storage keys
const PracticeContext = createContext(null);

const PROGRESS_KEY = "algorise-checkpoints";
const TARGET_KEY = "algorise-daily-target";
const QUEUE_KEY = "algorise-daily-queue";

// Read data from localStorage safely
const readStored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Main Practice Provider
export function PracticeProvider({ children }) {
  const { user } = useAuth();

  const profileKey = user?.id || user?.email || "guest";

  return (
    <PracticeSession key={profileKey} profileKey={profileKey}>
      {children}
    </PracticeSession>
  );
}

// Practice Session
function PracticeSession({ children, profileKey }) {
  // User-specific storage keys
  const progressKey = `${PROGRESS_KEY}:${profileKey}`;
  const targetKey = `${TARGET_KEY}:${profileKey}`;
  const queueKey = `${QUEUE_KEY}:${profileKey}`;

  // State management
  const [dailyTarget, setDailyTarget] = useState(() => Math.max(1, Number(readStored(targetKey, 5)) || 5));

  const [progress, setProgress] = useState(() => readStored(progressKey, {}));

  const [questions, setQuestions] = useState(() => readStored(queueKey, []));

  const [lastOutcome, setLastOutcome] = useState(null);
  const [generationBusy, setGenerationBusy] = useState(false);
  const [generationError, setGenerationError] = useState("");

  // Persist state in localStorage
  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress, progressKey]);

  useEffect(() => {
    localStorage.setItem(targetKey, JSON.stringify(dailyTarget));
  }, [dailyTarget, targetKey]);

  useEffect(() => {
    localStorage.setItem(queueKey, JSON.stringify(questions));
  }, [queueKey, questions]);

  // Calculate practice statistics
  const stats = useMemo(() => {
    const byTopic = {};

    Object.values(progress).forEach((record) => {
      if (!record.topic) return;

      const topic = byTopic[record.topic] || {
        solved: 0,
        review: 0,
      };

      if (record.status === "SOLVED") {
        topic.solved += 1;
      }

      if (record.status === "REVIEW" || record.status === "SKIPPED") {
        topic.review += 1;
      }

      byTopic[record.topic] = topic;
    });

    return {
      solved: Object.values(progress).filter(
        (item) => item.status === "SOLVED"
      ).length,

      review: Object.values(progress).filter(
        (item) => item.status === "REVIEW" || item.status === "SKIPPED").length,

      byTopic,
    };
  }, [progress]);

  // Generate daily question set
  async function generateDailySet(target = dailyTarget) {
    const safeTarget = Math.max(1,Math.min(12, Number(target) || dailyTarget));

    setDailyTarget(safeTarget);
    setGenerationBusy(true);
    setGenerationError("");

    // Calculate how many review questions to carry forward
    const reviewLimit = safeTarget === 1 ? 1 : Math.max(1, Math.floor(safeTarget * 0.3));

    // Select previously skipped or review questions
    const carryReviews = Object.values(progress)
      .filter(
        (record) =>
          (record.status === "REVIEW" || record.status === "SKIPPED") && record.question?.id
      )
      .map((record) => record.question)
      .filter(
        (question, index, list) =>
          list.findIndex((item) => item.id === question.id) === index
      )
      .slice(0, reviewLimit);

    // Exclude carried questions from the avoid list
    const carryIds = new Set(carryReviews.map((question) => question.id));

    // Build a list of questions to avoid generating again
    const avoidSlugs = new Set([
      ...Object.entries(progress)
        .filter(([id, record]) => record.status === "SOLVED" && !carryIds.has(id))
        .map(([id]) => id),

      ...questions
        .map((question) => question.id)
        .filter(
          (id) =>
            !carryIds.has(id) &&
            progress[id]?.status !== "REVIEW" &&
            progress[id]?.status !== "SKIPPED"),
    ]);

    // Calculate the number of new questions needed
    const newCount = Math.max(0, safeTarget - carryReviews.length);

    try {
      // Generate new questions through the API
      const result = newCount
        ? await questionApi.generateDaily({
            count: newCount,
            topicPerformance: stats.byTopic,
            avoidSlugs: [...avoidSlugs],
          })
        : { questions: [] };

      // Combine review questions with newly generated questions
      const nextSet = [...carryReviews, ...(result.questions || []), ];

      setQuestions(nextSet);
      setLastOutcome(null);

      return nextSet;
    } catch (error) {
      setGenerationError(error.message || "Could not generate today's DSA questions.");

      return null;
    } finally {
      setGenerationBusy(false);
    }
  }

  // Save question outcome and update progress
  function checkpoint(question, outcome) {
    if (!question) return;

    const solved = outcome === "EASY_ONE_TRY" || outcome === "SOLVED_AFTER_TRIES";

    const status = solved
      ? "SOLVED"
      : outcome === "SKIPPED"
        ? "SKIPPED"
        : "REVIEW";

    setProgress((current) => ({
      ...current,

      [question.id]: {
        status,
        outcome,
        topic: question.topic,
        question,

        attempts:
          (current[question.id]?.attempts || 0) + 1,

        updatedAt: new Date().toISOString(),
      },
    }));

    setLastOutcome({ question, outcome });
  }

  // Provide practice data and functions to descendants
  return (
    <PracticeContext.Provider
      value={{
        questions,
        progress,
        dailyTarget,
        setDailyTarget,
        generateDailySet,
        generationBusy,
        generationError,
        checkpoint,
        stats,
        lastOutcome,
        setLastOutcome,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

// Custom hook to access PracticeContext
// eslint-disable-next-line react/only-export-components
export function usePractice() {
  const context = useContext(PracticeContext);

  if (!context) {
    throw new Error("usePractice must be used inside PracticeProvider");
  }

  return context;
}
