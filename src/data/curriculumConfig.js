// OY4CCurriculum page: values from Sasha (curriculum lead), verbatim, and the
// information still missing. Never invent a value here: each one must come
// from Sasha / Ava. The page hides or falls back cleanly while a value is empty.

// Tier names (Sasha).
export const TIER_1_NAME = 'Seed'
export const TIER_2_NAME = 'Sprout'

// Link to the Seed access form (Sasha). Opens in a new tab.
// If emptied, every access button falls back to the provisional mailto.
export const TIER1_ACCESS_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf4Ma7BBsfGN3NsUCgfmTeRQCDtT3C6lqNn0WrHhoKYQuTmiA/viewform?usp=header'

// Map counter (Sasha). The counter stays hidden until all three are set.
export const COUNTER = { communities: 25, countries: 18, students: '1,200+' }
// TODO: CONFIRM WITH AVA. Ava's original label was "schools"; Sasha suggests
// "communities or OY4CCurriculum learners". Provisional.
export const COUNTER_COMMUNITIES_LABEL = 'Communities'

// Milan case study (Istituto Leone XIII). Date: Ava ("just say 2024-2025").
export const CASE_STUDY_2_DATE = '2024-2025'
// Before / during / after recap validated by Ava ("The recap is good"), verbatim.
export const CASE_STUDY_2_RECAP = [
  'Before: Feeling pessimistic about the climate crisis, worrying about the lack of interest in the matter from my peers',
  'During: Feeling the magnitude of my voice, noticing curiosity and interest spark amongst my peers',
  'After: Feeling freshly inspired in my own work, excited to create more change',
]
// TODO: ASK SASHA. Quote for the Milan case study, and who said it. Not shown
// while empty.
export const CASE_STUDY_2_QUOTE_TEXT = ''

// Case study photos (Ava: "please add pictures to these case studies"). None
// received yet. To add one: put the file in public/curriculum/case-studies/
// and set its path here, e.g. '/curriculum/case-studies/milan.webp'. Each
// photo is shown on its pin's card, and hidden while its path is empty.
export const CASE_STUDY_PHOTOS = { milano: '', thimphu: '' }

// Answer to "How long does each topic take?" (Sasha).
export const FAQ_TOPIC_DURATION_ANSWER =
  'Each topic lasts about 90 minutes, and can be split into subsections to suit your teaching plan. It is up to you how you want to use the available materials.'

// Flexibility FAQ (Sasha). Nothing is shown while either is empty.
export const FAQ_FLEXIBILITY = {
  question: 'How many OY4CCurriculum topics should I teach?',
  answer:
    "You are welcome to teach as many or as few of the topics as you wish, however, to access the Sprout tier (which contains these 7 topics - Emissions, Pollution, Mitigation Strategies, Plastic Waste, Food Management, Oceans - you must teach and submit feedback and evidence for at least 1 topic in the Seed tier. All the information for how to access the Sprout tier is detailed in your welcome email, as well as in the Seed topic drive, in the folder titled 'Accessing the Sprout tier'.",
}

// Extra FAQ entries (Sasha), shown after the topic duration question.
export const FAQ_SASHA = [
  {
    q: 'Does OY4C support in teaching the OY4CCurriculum?',
    a: 'We have built out all the resources you may need to teach, including Canva slides, a script and quizzes with answer keys. We encourage you to be a leader in climate change education in your community! If you have any questions, please contact curriculum@oy4c.org with a relevant email subject line, and our team will be happy to help out.',
  },
  {
    q: 'Is the OY4CCurriculum available only in English?',
    a: 'Yes, currently the OY4CCurriculum is only available in English, but we are looking into translation options.',
  },
]

// Why OY4C asks for feedback, shown in step 4 (Sasha).
export const TIER_FEEDBACK_WHY =
  'Your feedback helps us to better understand the needs of educators and students, and improve the content and relevance of the OY4CCurriculum for all who learn with us. Thank you!'

// TODO: PROVISIONAL. Tier visual (Sasha): she will send her own visual, and
// the structure may change after a meeting with Ava.
export const TIERS = [
  {
    name: TIER_1_NAME,
    status: 'Available now',
    topics: [
      'Climate Education',
      'Fashion Industry',
      'Indigenous Peoples & Climate Change',
      'Nature Conservation',
      'Environmental Policy & Politics',
      'Eco-anxiety',
    ],
  },
  {
    name: TIER_2_NAME,
    status: 'Unlock with feedback',
    // "Climate Justice" placed in Sprout (it directly followed Sasha's Sprout line).
    topics: [
      'Climate Justice',
      'Emissions',
      'Pollution',
      'Mitigation Strategies',
      'Plastic Waste',
      'Food Management',
      'Ocean',
    ],
  },
]
export const TIERS_NOTE =
  'To unlock Sprout tier, educators need to teach and provide evidence and feedback for 1 topic of their choice, at minimum - they are of course welcome to teach as many as they like!'
