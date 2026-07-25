export const categories = [
  {
    key: 'Foundations',
    name: 'Foundations',
    description: 'Greetings, introducing yourself, numbers & money — the basics you need before anything else.',
    emoji: '🌱',
  },
  {
    key: 'Getting Around',
    name: 'Getting Around',
    description: 'Autos, cabs, buses, metro, and asking for directions in the city.',
    emoji: '🛺',
  },
  {
    key: 'Daily Life',
    name: 'Daily Life',
    description: 'Shopping, markets, food & tea stalls, and phone calls.',
    emoji: '🛍️',
  },
  {
    key: 'People & Talk',
    name: 'People & Talk',
    description: 'Small talk with neighbors, family words, and sharing feelings & opinions.',
    emoji: '💬',
  },
  {
    key: 'Real-World Situations',
    name: 'Real-World Situations',
    description: 'Bargaining, pharmacy visits, house-hunting, emergencies, festivals, and street slang.',
    emoji: '🏙️',
  },
]

export const getCategory = (key) => categories.find((c) => c.key === key)
