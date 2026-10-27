// Title, meta description and canonical path for every route of App.jsx.
// Single source of truth: read by usePageMeta (client-side navigation) and by
// the pre-render step in vite.config.js (one HTML file per route, so the right
// title is there before any JavaScript runs).
// Titles 50-60 characters, descriptions 120-160, all built from text already
// on each page (eyebrow, headline, first sentence). To be reviewed by Ava.

export const SITE_URL = 'https://oy4c.org'

export const HOME_META = {
  path: '/',
  title: 'Our Youth 4 The Climate — Youth-led climate change education',
  description: 'OY4C empowers the next generation with high-quality, accessible, youth-led climate change education, in classrooms across six continents.',
}

export const PAGE_META = {
  '/': HOME_META,
  '/about': {
    title: 'Who Are We — The story behind Our Youth 4 The Climate',
    description: 'OY4C has one goal. Climate change education for an entire generation, written by the generation inheriting it. 133 young people across 43 countries.',
  },
  '/team': {
    title: 'Meet the Team — The people behind Our Youth 4 The Climate',
    description: 'OY4C is powered by a global community of passionate young people: educators, researchers, designers, and advocates, united by a common mission.',
  },
  '/curriculum': {
    title: 'OY4CCurriculum — Free, ready-to-use climate education',
    description: 'Ready-to-use climate change education open-resource, built by young people for young people: 13 interdisciplinary topics, free for every classroom.',
  },
  '/services': {
    title: 'Our services — Climate education, built by young people',
    description: 'We partner with organisations to build resources, share opportunities and lead conversations that reach the next generation.',
  },
  '/ccic': {
    title: 'CCiC — Climate Curriculum into Classrooms workshops | OY4C',
    description: 'CCiC is a free, 1h30 in-person climate workshop, designed and delivered by young people, for students aged 12-18. We bring everything. You open the door.',
  },
  '/ambassador': {
    title: 'Ambassador Programme — Leadership & advocacy | OY4C',
    description: 'A 6-month leadership initiative bringing together young leaders committed to advancing climate literacy and advocacy within their communities.',
  },
  '/last-push': {
    title: 'The Last Push — Campaign by Our Youth 4 The Climate',
    description: 'The Last Push: a campaign mobilising youth for urgent climate milestones, by Our Youth 4 The Climate (OY4C). Full details coming soon.',
  },
  '/impact': {
    title: 'Our impact: measuring what matters — Our Youth 4 The Climate',
    description: "Our impact. From classrooms in Fiji to communities in Nigeria, here's what OY4C has built, reached, and changed since day one.",
  },
  '/blog': {
    title: 'OY4C Blog — Stories from the field | Our Youth 4 The Climate',
    description: 'Stories from the field: insights, updates, and stories from our global network of youth climate educators at Our Youth 4 The Climate.',
  },
  '/contact': {
    title: 'Contact Us — Get in touch with Our Youth 4 The Climate',
    description: "Contact Our Youth 4 The Climate. Have a question, a partnership idea, or want to bring OY4C to your school? We'd love to hear from you.",
  },
  '/partnerships': {
    title: 'Partnerships — Building a global coalition for change | OY4C',
    description: 'OY4C partners with organisations that share our commitment to youth empowerment, climate change education, and systemic change. Together, we go further.',
  },
  '/speaker': {
    title: 'Speaker Programme — Youth climate educators from OY4C',
    description: 'Speaker Programme: OY4C youth climate educators are available to speak at schools, conferences, panels, and events worldwide.',
  },
  '/consultancy': {
    title: 'Consultancy — Climate change education guidance | OY4C',
    description: "Consultancy: expert guidance from OY4C's global network to help your organisation embed high-quality climate change education.",
  },
  '/takeaction': {
    title: 'Take Action — Get involved with Our Youth 4 The Climate',
    description: 'Get involved: join the OY4C movement, take the pledge, integrate our curriculum, and become a climate advocate in your community.',
  },
  '/legal': {
    title: 'Legal Notice — Our Youth 4 The Climate (OY4C) website',
    description: 'This website, oy4c.org, is published by Climate 2025 Limited, trading as Host, the fiscal host of the project Our Youth 4 The Climate (OY4C).',
  },
  '/privacy': {
    title: 'Privacy Policy — How Our Youth 4 The Climate handles data',
    description: 'This policy explains how Our Youth 4 The Climate (OY4C) handles personal data in connection with the website oy4c.org, under the UK GDPR.',
  },
  '/cookies': {
    title: 'Cookies Policy — Our Youth 4 The Climate (OY4C) website',
    description: 'This website does not use cookies to track you. It sets no cookies of its own and runs no analytics, advertising or profiling.',
  },
}

for (const [path, meta] of Object.entries(PAGE_META)) meta.path = path

// Shown while an article loads (no canonical until its id is confirmed).
export const BLOG_POST_LOADING_META = {
  title: PAGE_META['/blog'].title,
  description: PAGE_META['/blog'].description,
  path: null,
}

export const NOT_FOUND_META = {
  title: 'Page not found — Our Youth 4 The Climate (OY4C)',
  description: "The page you're looking for doesn't exist or may have moved.",
  path: null,
  noindex: true,
}

const BLOG_TITLE_SUFFIXES = [' — Our Youth 4 The Climate blog', ' | Our Youth 4 The Climate', ' | OY4C Blog', '']
const MAX_TITLE = 60
const MAX_DESCRIPTION = 160

// Cuts at the last word boundary that fits, adding an ellipsis.
function clip(text, max) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:.—-]+$/, '')}…`
}

// Meta for /blog/:id from the article's own title and excerpt (or its opening
// paragraphs when the excerpt is empty in Notion).
export function blogPostMeta(post, leadText = '') {
  const title = post.title?.trim() || 'Untitled'
  const suffix = BLOG_TITLE_SUFFIXES.find((s) => title.length + s.length <= MAX_TITLE) ?? ''
  const source = post.excerpt?.trim() || leadText || PAGE_META['/blog'].description
  return {
    title: clip(title + suffix, MAX_TITLE),
    description: clip(source, MAX_DESCRIPTION),
    path: `/blog/${post.id}`,
  }
}
