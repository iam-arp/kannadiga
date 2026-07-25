export const categories = [
  {
    key: 'Foundations',
    name: 'Foundations',
    description: 'Greetings, introducing yourself, numbers, money, and telling time — the basics you need before anything else.',
    emoji: '🌱',
  },
  {
    key: 'Getting Around',
    name: 'Getting Around',
    description: 'Autos, cabs, cab apps, buses, metro, tickets, and asking for directions in the city.',
    emoji: '🛺',
  },
  {
    key: 'Daily Life',
    name: 'Daily Life',
    description: 'Shopping, markets, food & tea stalls, phone calls, the salon, and the gym.',
    emoji: '🛍️',
  },
  {
    key: 'People & Talk',
    name: 'People & Talk',
    description: 'Small talk with neighbors, family words, feelings, opinions, plans, and compliments.',
    emoji: '💬',
  },
  {
    key: 'Real-World Situations',
    name: 'Real-World Situations',
    description: 'Bargaining, pharmacy visits, house-hunting, emergencies, banks, complaints, festivals, and street slang.',
    emoji: '🏙️',
  },
  {
    key: 'Culture & Wisdom',
    name: 'Culture & Wisdom',
    description: 'Apartment society life, temple visits, and the proverbs & sayings that season everyday speech.',
    emoji: '🪔',
  },
]

export const getCategory = (key) => categories.find((c) => c.key === key)
