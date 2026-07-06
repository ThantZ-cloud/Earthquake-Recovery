export const meta = {
  name: 'translate-routes',
  description: 'Translate donate, quiz, and history routes to Myanmar',
  phases: [
    { title: 'Translate Donate', detail: 'Add Myanmar translations for donate page items' },
    { title: 'Translate Quiz', detail: 'Add Myanmar translations for quiz page items' },
    { title: 'Translate History', detail: 'Add Myanmar translations for history page items' },
  ],
};

// Phase 1: Translate Donate
phase('Translate Donate');
const donateResult = await agent(
  `Translate the Donate page payment method instructions and detailed content to Myanmar (Burmese).

1. Read app/src/pages/Donate.jsx to find all hardcoded English text in payment methods, instructions, and dialog content
2. Read app/src/i18n/en.json to check existing donation translation keys
3. Read app/src/i18n/my.json to check existing Myanmar translations
4. Add new translation keys to en.json under "donate" section for any missing items (payment method names, step-by-step instructions, dialog text)
5. Add corresponding Myanmar translations to my.json with natural, conversational Burmese (not formal/literal)
6. Update Donate.jsx to use t() calls for any hardcoded English text that was found

Focus on: payment method instructions, dialog content, step-by-step guides, and any other UI text that hasn't been translated yet.

Return a summary of what was translated.`,
  { label: 'donate-translate', phase: 'Translate Donate' }
);

// Phase 2: Translate Quiz
phase('Translate Quiz');
const quizResult = await agent(
  `Translate the Quiz page questions and content to Myanmar (Burmese).

1. Read app/src/pages/Quiz.jsx to find all hardcoded English text including quiz questions, answer options, score messages, and UI text
2. Read app/src/i18n/en.json to check existing quiz translation keys
3. Read app/src/i18n/my.json to check existing Myanmar translations
4. Add new translation keys to en.json under "quiz" section for any missing items (questions, answers, feedback messages)
5. Add corresponding Myanmar translations to my.json with natural, conversational Burmese (not formal/literal)
6. Update Quiz.jsx to use t() calls for any hardcoded English text

Focus on: quiz questions, answer options, score feedback, and any other quiz content that hasn't been translated yet.

Return a summary of what was translated.`,
  { label: 'quiz-translate', phase: 'Translate Quiz' }
);

// Phase 3: Translate History
phase('Translate History');
const historyResult = await agent(
  `Translate the History page earthquake descriptions and content to Myanmar (Burmese).

1. Read app/src/pages/History.jsx to find all hardcoded English text including earthquake descriptions, impact text, and any other content
2. Read app/src/i18n/en.json to check existing history translation keys
3. Read app/src/i18n/my.json to check existing Myanmar translations
4. Add new translation keys to en.json under "history" section for any missing items (earthquake impact descriptions, detailed content)
5. Add corresponding Myanmar translations to my.json with natural, conversational Burmese (not formal/literal)
6. Update History.jsx to use t() calls for any hardcoded English text

Focus on: earthquake impact descriptions for international and Myanmar earthquakes, and any other detailed content that hasn't been translated yet.

Return a summary of what was translated.`,
  { label: 'history-translate', phase: 'Translate History' }
);

return {
  donate: donateResult,
  quiz: quizResult,
  history: historyResult,
};