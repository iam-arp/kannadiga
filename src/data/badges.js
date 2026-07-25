function countLessons(ctx, predicate) {
  return ctx.lessons.filter((l) => predicate(ctx.progress[l.id] || {})).length
}

export const badges = [
  {
    id: 'first-steps',
    name: 'First Steps',
    emoji: '🌱',
    description: 'Complete your first lesson.',
    isUnlocked: (ctx) => countLessons(ctx, (p) => ctx.isComplete(p)) >= 1,
  },
  {
    id: 'getting-fluent',
    name: 'Getting Fluent',
    emoji: '🗣️',
    description: 'Complete 10 lessons.',
    isUnlocked: (ctx) => countLessons(ctx, (p) => ctx.isComplete(p)) >= 10,
  },
  {
    id: 'kannadiga-pro',
    name: 'Kannadiga Pro',
    emoji: '👑',
    description: 'Complete every lesson in the app.',
    isUnlocked: (ctx) => countLessons(ctx, (p) => ctx.isComplete(p)) >= ctx.lessons.length,
  },
  {
    id: 'sharp-shooter',
    name: 'Sharp Shooter',
    emoji: '🎯',
    description: 'Score 100% on any quiz.',
    isUnlocked: (ctx) =>
      countLessons(ctx, (p) => p.quiz && p.quiz.total > 0 && p.quiz.bestScore === p.quiz.total) >= 1,
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    emoji: '💬',
    description: 'Finish the conversation practice in 10 lessons.',
    isUnlocked: (ctx) => countLessons(ctx, (p) => p.conversationDone) >= 10,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    emoji: '🔥',
    description: 'Reach a 7-day learning streak.',
    isUnlocked: (ctx) => ctx.streak.longest >= 7,
  },
  {
    id: 'vocab-collector',
    name: 'Vocab Collector',
    emoji: '📚',
    description: 'Review vocab in 15 lessons.',
    isUnlocked: (ctx) => countLessons(ctx, (p) => p.vocabDone) >= 15,
  },
  {
    id: 'dictation-ace',
    name: 'Dictation Ace',
    emoji: '✍️',
    description: 'Get a perfect dictation score in 5 lessons.',
    isUnlocked: (ctx) =>
      countLessons(
        ctx,
        (p) => p.dictation && p.dictation.total > 0 && p.dictation.bestScore === p.dictation.total,
      ) >= 5,
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    emoji: '⭐',
    description: 'Reach level 5.',
    isUnlocked: (ctx) => ctx.level >= 5,
  },
]
