import greetings from './01-greetings.js'
import introductions from './02-introductions.js'
import numbersMoney from './03-numbers-money.js'
import autoRickshaw from './04-auto-rickshaw.js'
import directions from './05-directions.js'
import busMetro from './06-bus-metro.js'
import localShopping from './07-local-shopping.js'
import vegetableMarket from './08-vegetable-market.js'
import darshiniTeaStall from './09-darshini-tea-stall.js'
import phoneConversations from './10-phone-conversations.js'
import neighborSmallTalk from './11-neighbor-small-talk.js'
import family from './12-family.js'
import feelingsOpinions from './13-feelings-opinions.js'
import bargaining from './14-bargaining.js'
import pharmacyDoctor from './15-pharmacy-doctor.js'
import houseHunting from './16-house-hunting.js'
import emergencies from './17-emergencies.js'
import slangAndFestivals from './18-slang-and-festivals.js'

export const lessons = [
  greetings,
  introductions,
  numbersMoney,
  autoRickshaw,
  directions,
  busMetro,
  localShopping,
  vegetableMarket,
  darshiniTeaStall,
  phoneConversations,
  neighborSmallTalk,
  family,
  feelingsOpinions,
  bargaining,
  pharmacyDoctor,
  houseHunting,
  emergencies,
  slangAndFestivals,
].sort((a, b) => a.order - b.order)

export const getLesson = (id) => lessons.find((l) => l.id === id)

export const getLessonsByCategory = (categoryKey) =>
  lessons.filter((l) => l.category === categoryKey)

export const getAdjacentLessons = (id) => {
  const index = lessons.findIndex((l) => l.id === id)
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
  }
}
