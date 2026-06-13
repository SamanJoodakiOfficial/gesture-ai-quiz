export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getDifficultyLabel(difficulty) {
  if (difficulty <= 1) return 'آسان';
  if (difficulty === 2) return 'متوسط';
  return 'سخت';
}

export function calculateMastery(history) {
  if (!history.length) return 0;
  const correct = history.filter((item) => item.isCorrect).length;
  return Math.round((correct / history.length) * 100);
}

export function calculateUtility({ difficulty, streak, mastery }) {
  const difficultyWeight = difficulty * 12;
  const streakWeight = Math.min(streak, 5) * 7;
  const masteryWeight = mastery * 0.35;
  return Math.round(difficultyWeight + streakWeight + masteryWeight);
}

export function chooseNextQuestion({ questions, askedIds, currentDifficulty, wasCorrect, streak }) {
  const nextDifficulty = clamp(
    wasCorrect ? currentDifficulty + (streak >= 2 ? 1 : 0) : currentDifficulty - 1,
    1,
    3,
  );

  const unasked = questions.filter((question) => !askedIds.includes(question.id));
  if (!unasked.length) return { question: null, nextDifficulty };

  const exactDifficulty = unasked.filter((question) => question.difficulty === nextDifficulty);
  const pool = exactDifficulty.length ? exactDifficulty : unasked;
  const sorted = [...pool].sort((a, b) => a.id - b.id);

  return {
    question: sorted[0],
    nextDifficulty,
  };
}

export function getFeedbackText({ selectedKey, correctKey, isCorrect, skipped }) {
  if (skipped) return 'سوال رد شد. عامل سوال بعدی را با سطح مناسب انتخاب می‌کند.';
  if (isCorrect) return `درست بود. گزینه ${selectedKey} پاسخ صحیح است.`;
  return `اشتباه بود. گزینه درست ${correctKey} است.`;
}

export function getAgentDescription() {
  return {
    percept: 'ژست دست، confidence مدل، سوال فعلی، سابقه پاسخ‌های کاربر',
    action: 'انتخاب گزینه، رد کردن سوال، تغییر سطح سختی، انتخاب سوال بعدی',
    performance: 'افزایش پاسخ‌های درست، کاهش خطای ژست، تطبیق سطح سوال با کاربر',
    environment: 'مرورگر، وب‌کم، کاربر، صفحه آزمون',
  };
}
