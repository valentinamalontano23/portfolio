/* =============================================================================
   SITE CONTENT — this is the only file you need to touch to update the website.
   Anything written like [THIS] is a placeholder waiting for a real value.
   Images live in src/assets/ — drop a real photo in with the same filename
   (and a similar shape) and it appears everywhere that image is used.
   ============================================================================= */

import portraitArch from '../assets/portrait-arch.webp'
import aboutHills from '../assets/about-hills.webp'
import catTravel from '../assets/cat-travel.webp'
import catHospitality from '../assets/cat-hospitality.webp'
import catLifestyle from '../assets/cat-lifestyle.webp'
import catUgc from '../assets/cat-ugc.webp'
import workBubbleroom from '../assets/work-bubbleroom.webp'
import bubbleroom2 from '../assets/bubbleroom-2.webp'
import bubbleroom3 from '../assets/bubbleroom-3.webp'
import workVegas from '../assets/work-vegas.webp'
import vegas2 from '../assets/vegas-2.webp'
import vegas3 from '../assets/vegas-3.webp'
import workCappadocia from '../assets/work-cappadocia.webp'
import cappadocia2 from '../assets/cappadocia-2.webp'
import cappadocia3 from '../assets/cappadocia-3.webp'
import workBackpack from '../assets/work-backpack.webp'
import backpack2 from '../assets/backpack-2.webp'
import backpack3 from '../assets/backpack-3.webp'
import rangeCinematic from '../assets/range-cinematic.webp'
import rangeRelatable from '../assets/range-relatable.webp'
import rangeEducational from '../assets/range-educational.webp'
import rangeAspirational from '../assets/range-aspirational.webp'
import specBag from '../assets/spec-bag.webp'
import specHotel from '../assets/spec-hotel.webp'
import specApp from '../assets/spec-app.webp'
import specFashion from '../assets/spec-fashion.webp'
import specProduct from '../assets/spec-product.webp'
import contactSunset from '../assets/contact-sunset.webp'
import brandGetYourGuide from '../assets/brand-getyourguide.svg'
import brandHolafly from '../assets/brand-holafly.svg'
import brandTravelAdvantage from '../assets/brand-travel-advantage.png'
import brandStratford from '../assets/brand-stratford-perth-museum.webp'
import brandSkyroom from '../assets/brand-skyroom-carrara.webp'

/* -------------------------------------------------------------------- who */
/* Joined at run time. Deliberately not a template literal: a bundler folds
   those back into the one string this is meant to avoid. */
export const contactEmail = () => [profile.emailUser, profile.emailDomain].join('@')

export const profile = {
  name: "Valentina D'Ambrosio",
  first: 'Valentina',
  role: 'Travel • Lifestyle • UGC Creator',
  handle: '@va_lentina_ma_lontano',
  /* Kept in two halves on purpose. Written whole it would sit as a plain
     string in the published JavaScript, and address harvesters sweep files
     for exactly that shape. Change these two to change the address. */
  emailUser: 'va.lentina.ma.lontano23',
  emailDomain: 'gmail.com',
  instagram: 'https://instagram.com/va_lentina_ma_lontano',
  tiktok: '[TIKTOK URL]', // leave as-is to hide the TikTok link
  base: 'Worldwide creator · working internationally',
  year: 2026
}

/* Every image on the site is currently stand-in artwork. Set this to false
   once real photography is in place and the small "placeholder" badges
   disappear site-wide. */
export const usingPlaceholderVisuals = false

/* Sections parked in standby: still in the codebase, with their content
   untouched further down this file, but not rendered. Delete an id from this
   list and the section returns exactly where it was.
     'range' -> "One creator. Multiple ways to tell a story."
     'spec'  -> "Spec work."                                                  */
export const standbySections = ['range', 'spec']

/* ------------------------------------------------------------------- nav */
export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'why', label: 'Why me' },
  { id: 'contact', label: 'Contact' }
]

/* ------------------------------------------------------------------ hero */
export const hero = {
  kicker: 'Travel / Hospitality / UGC',
  headlineTop: "I don't just visit places.",
  headlineBottom: 'I experience them',
  headlineTail: '— and turn them into stories.',
  micro:
    'Creating engaging travel, hospitality and lifestyle content for brands people want to experience.',
  imageAlt:
    "Valentina D'Ambrosio at golden hour on the shore of a forested lake, backlit by the low sun",
  primaryCta: "Let's work together",
  secondaryCta: 'View my work'
}

/* --------------------------------------------------------- discovery bar */
/* Each chip lights up everything on the page tagged with the same id. */
export const discovery = {
  prompt: 'What are you looking for?',
  hint: 'Pick a direction — the work reorders around it.',
  categories: [
    { id: 'travel', label: 'Travel', note: 'Destination storytelling' },
    { id: 'hotels', label: 'Hotels', note: 'Stays & hospitality' },
    { id: 'ugc', label: 'UGC', note: 'Brand-owned short form' },
    { id: 'lifestyle', label: 'Lifestyle', note: 'Everyday, on camera' },
    { id: 'fashion', label: 'Veg Food', note: 'Travel style & beauty' },
    { id: 'destinations', label: 'Destinations', note: 'Places, felt' }
  ]
}

/* ----------------------------------------------------------------- about */
export const about = {
  eyebrow: 'About',
  titleTop: "I don't just visit places.",
  titleBottom: 'I experience them.',
  paragraphs: [
    "I'm Valentina, an Italian travel & lifestyle creator passionate about discovering new places, cultures and experiences — and turning them into stories people want to be part of.",
    'My content combines travel, veg food, lifestyle and authentic storytelling, with a visual style that is vibrant, warm and sophisticated.',
    'From low-cost adventures and hostels to unique stays and luxury experiences, I believe great travel is not about how much you spend — but how much you experience.'
  ],
  pull: 'Travel is not only about places. It is about experiences, emotions, people and stories.',
  cta: "Let's create something together",
  portrait: portraitArch,
  portraitAlt:
    "Valentina D'Ambrosio on a rooftop terrace at dusk, the Toronto skyline and the CN Tower behind her",
  secondary: aboutHills,
  secondaryAlt: 'A large group gathered indoors at an evening celebration',
  facts: [
    { label: 'Availability', value: 'Worldwide' },
    { label: 'Working in', value: 'English & Italian' },
    { label: 'Creating', value: 'Reels · Carousels · Photos' }
  ]
}

/* --------------------------------------------------------- what I create */
export const creates = [
  {
    id: 'travel',
    title: 'Travel',
    image: catTravel,
    imageAlt:
      'Valentina in a white shirt and gold headscarf in the marble courtyard of a domed mosque',
    tags: ['travel', 'destinations'],
    description: 'Places turned into a reason to go — not just a postcard.',
    items: ['Destination storytelling', 'Travel guides', 'Experiences', 'Tourism content']
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    image: catHospitality,
    imageAlt:
      'Valentina on the bed of an ornate hotel suite, with a blue velvet headboard and a crystal chandelier',
    tags: ['hotels', 'travel'],
    description: 'The feeling of arriving somewhere, told from the guest side.',
    items: ['Hotels', 'Hostels', 'Unique stays', 'Hospitality experiences']
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    image: catLifestyle,
    imageAlt:
      'Valentina in a long dress on a Cappadocia terrace at sunrise, hot-air balloons rising over the valley',
    tags: ['lifestyle', 'fashion'],
    description: 'What travel looks like when you actually have to wear it.',
    items: ['Travel outfits', 'Accessories', 'Beauty & lifestyle', 'Travel essentials']
  },
  {
    id: 'ugc',
    title: 'UGC',
    image: catUgc,
    imageAlt:
      'Valentina eating a plate of pasta at a table, framed close up for short-form video',
    tags: ['ugc', 'lifestyle'],
    description: 'Content built for your channels, your feed, your paid ads.',
    items: ['Product demonstrations', 'Voice-over videos', 'Lifestyle content', 'Short-form storytelling']
  }
]

/* ------------------------------------------------------------- statement */
export const statement = {
  line: 'Content that feels like a story',
  emphasis: 'not an ad.'
}

/* --------------------------------------------------------- selected work */
/* video: replace [VIDEO URL] with an .mp4/.webm URL (or a local import) and
   the project modal plays it inline instead of showing the poster frame. */
export const projects = [
  {
    id: 'bubbleroom',
    index: '01',
    title: 'Skyroom',
    place: 'Carrara, Italy',
    category: 'Hospitality / Travel / Storytelling',
    tags: ['hotels', 'travel', 'destinations', 'ugc'],
    phrase: 'A room with no walls between you and the sky.',
    cover: workBubbleroom,
    coverAlt:
      'Valentina in a bubbling hot tub lit in pink, holding a drink, inside the Skyroom at Carrara',
    summary:
      'A transparent room in the hills above Carrara, shot as an overnight story: the arrival, the light going down, the sky at the top of the frame. The kind of stay that only makes sense when someone shows you what it feels like from the inside.',
    deliverables: [
      'Destination storytelling',
      'Accommodation experience',
      'Visual storytelling',
      'Short-form video'
    ],
    gallery: [bubbleroom2, bubbleroom3],
    video: 'videos/reel-bubbleroom.mp4',
    // add a line here when a stay was hosted or a collaboration was paid
    note: ''
  },
  {
    id: 'vegas',
    index: '02',
    title: 'Las Vegas',
    place: 'Nevada, USA',
    category: 'Travel / Experience / Social Content',
    tags: ['travel', 'destinations', 'lifestyle', 'ugc'],
    phrase: 'A city built for the camera — and still full of surprises.',
    cover: workVegas,
    coverAlt:
      'Valentina in front of the Welcome to Fabulous Las Vegas sign under a clear blue sky',
    summary:
      'A stay turned into a social-first edit: what the room looks like and what the hotels offers, what is worth the money and what is not. Showing and explaining people how to save money when they travel. Here is when you suggest travel plattforms instead of others.',
    deliverables: [
      'Stay-to-story concept',
      'Short-form video series',
      'Experience highlights',
      'Location storytelling'
    ],
    gallery: [vegas2, vegas3],
    video: 'videos/reel-vegas.mp4',
    note: ''
  },
  {
    id: 'cappadocia',
    index: '03',
    title: 'Cappadocia',
    place: 'Türkiye',
    category: 'Destination Storytelling / Cinematic Travel',
    tags: ['travel', 'destinations'],
    phrase: 'Destinations should be felt.',
    cover: workCappadocia,
    coverAlt:
      'Valentina from behind in a red jacket, watching dozens of hot-air balloons rise over the Cappadocia valley at dawn',
    summary:
      'Sunrise, altitude, and a valley that does most of the work. Shot for mood rather than information: slow frames, a single piece of music, and an edit that lets the place land before anything is explained.',
    deliverables: [
      'Visual storytelling',
      'Destination mood',
      'Emotional travel content',
      'Cinematic short-form video'
    ],
    gallery: [cappadocia2, cappadocia3],
    video: 'videos/reel-cappadocia.mp4',
    note: ''
  },
  {
    id: 'backpack',
    index: '04',
    title: 'Travel Backpack',
    place: 'On the way to the gate',
    category: 'UGC / Humor / Relatable Travel',
    tags: ['ugc', 'lifestyle', 'travel'],
    phrase: "Travel doesn't have to be serious.",
    cover: workBackpack,
    coverAlt:
      'Valentina in an airport terminal carrying a black travel backpack with a water bottle in the side pocket',
    /* This shot is portrait and the card that holds it is landscape, so only
       half its height is ever on screen. Left centred, the crop starts at the
       chin. Keep it high so the face stays in frame with the backpack. */
    coverPosition: 'center 17%',
    summary:
      'The bag test everyone recognises: packing it, over-packing it, and walking it past the sizer. Written for the joke first, with the product doing the work in the background — the format that keeps people watching to the end.',
    deliverables: ['Humor', 'Travel hacks', 'Relatable storytelling', 'Short-form content'],
    gallery: [backpack2, backpack3],
    video: 'videos/reel-backpack.mp4',
    note: ''
  }
]

/* ------------------------------------------------------- collaborations */
/* Heights are per-logo on purpose. Set to one uniform height, a wide wordmark
   reads far heavier than a round mark, so each value below is the height at
   which that mark covers roughly the same optical area as the others.
   Measured from the real artwork: wordmarks land near 2.8rem, round marks
   near 4.4rem. Add a brand by dropping its file in src/assets and copying
   a line — keep the height in that range for its shape.
   `w`/`h` are the file's real pixel size, so the row holds its shape
   before the images arrive instead of jumping.

   Measured against the navy ground, three marks already clear 3:1 on their
   own — GetYourGuide 96%, Holafly 92%, Skyroom 89% — and keep their brand
   colours. Two do not, both because their ink is dark: Stratford is not
   even transparent (a white rectangle with black type, 68% near-white
   pixels) and Travel Advantage is 74% dark ink, reaching only 23%. Those
   two carry `reverse`, which flips them to light and knocks their
   background out. */
export const collabs = {
  eyebrow: 'Collaborations',
  title: "Brands I've",
  italic: 'worked with.',
  subtitle: 'Travel, hospitality and lifestyle partners — on my channels and on theirs.',
  logos: [
    { id: 'getyourguide', name: 'GetYourGuide', logo: brandGetYourGuide, w: 382, h: 302, height: '4.25rem' },
    { id: 'holafly', name: 'Holafly', logo: brandHolafly, w: 1100, h: 385, height: '2.8rem' },
    { id: 'travel-advantage', name: 'Travel Advantage', logo: brandTravelAdvantage, w: 960, h: 312, height: '2.7rem', reverse: true },
    { id: 'stratford', name: 'Stratford Perth Museum', logo: brandStratford, w: 651, h: 240, height: '2.85rem', reverse: true },
    /* No wordmark in the artwork, so the name is printed under the tile.
       A `caption` means that text labels the image, so the image itself
       is marked decorative and screen readers do not say the name twice. */
    { id: 'skyroom', name: 'Skyroom Carrara', logo: brandSkyroom, w: 2000, h: 1806, height: '4.5rem', caption: 'Skyroom Carrara' }
  ]
}

/* -------------------------------------------------------- creative range */
export const range = [
  {
    id: 'cinematic',
    title: 'Cinematic',
    caption: 'Emotional & visual',
    image: rangeCinematic,
    tags: ['travel', 'destinations'],
    body: 'Slow, composed, made to be felt. For destinations and stays that sell on atmosphere.'
  },
  {
    id: 'relatable',
    title: 'Relatable',
    caption: 'Funny & authentic',
    image: rangeRelatable,
    tags: ['ugc', 'lifestyle'],
    body: 'Talking to camera, no filter on the personality. The content people send to a friend.'
  },
  {
    id: 'educational',
    title: 'Educational',
    caption: 'Useful & informative',
    image: rangeEducational,
    tags: ['travel', 'ugc'],
    body: 'Tips, comparisons, how-to. Saves and shares, which is where the reach comes from.'
  },
  {
    id: 'aspirational',
    title: 'Aspirational',
    caption: 'Travel, veg food & lifestyle',
    image: rangeAspirational,
    tags: ['fashion', 'lifestyle', 'hotels'],
    body: 'The version people screenshot: the light, the outfit, the place they now want to book.'
  }
]

/* ------------------------------------------------------------- why me */
export const why = [
  {
    id: 'presence',
    icon: 'presence',
    title: 'Authentic on-camera presence',
    body: 'I create content that feels natural, warm and relatable — the reason people stay past the first two seconds.'
  },
  {
    id: 'story',
    icon: 'story',
    title: 'Travel-first storytelling',
    body: 'I know how to turn destinations and experiences into stories, with a beginning, a reason to keep watching and a reason to go.'
  },
  {
    id: 'range',
    icon: 'range',
    title: 'Versatile visual style',
    body: 'From hostels and low-cost adventures to luxury stays and veg food — the same eye, adapted to the budget in the room.'
  },
  {
    id: 'international',
    icon: 'globe',
    title: 'International perspective',
    body: 'Italian creator with an international lifestyle and travel mindset. Comfortable creating in English for a global audience.'
  },
  {
    id: 'social',
    icon: 'social',
    title: 'Content made for social',
    body: 'Short-form built for the platform it lives on: vertical, sound-on, designed to capture attention quickly.'
  }
]

/* -------------------------------------------------------------- numbers */
/* Placeholder figures — update these three values and nothing else changes. */
export const stats = [
  { value: '4.5K+', label: 'Instagram community' },
  { value: '200K+', label: 'Profile views · last 30 days' },
  { value: '4M+', label: 'Best-performing Reel' }
]
export const statsNote = 'Figures updated 09/26. Full media kit available on request.'

/* ------------------------------------------------------------ spec work */
export const spec = {
  eyebrow: 'Concept / Spec work',
  title: 'Spec work',
  subtitle:
    'Creative concepts created to show how I could bring a brand, product or experience to life. None of these are client campaigns — they are made to demonstrate approach.',
  items: [
    {
      id: 'bag',
      title: 'Travel bag',
      image: specBag,
      tags: ['ugc', 'travel'],
      body: 'One bag, seven days, a packing sequence that ends with the zip closing.'
    },
    {
      id: 'hotel',
      title: 'Hotel stay',
      image: specHotel,
      tags: ['hotels', 'travel'],
      body: 'Check-in to first morning, cut as the reason to book the room.'
    },
    {
      id: 'app',
      title: 'Travel app',
      image: specApp,
      tags: ['ugc', 'travel'],
      body: 'Screen-recorded demo with a voice-over that explains it in fifteen seconds.'
    },
    {
      id: 'fashion',
      title: 'Veg Food brand',
      image: specFashion,
      tags: ['fashion', 'lifestyle'],
      body: 'Three looks, one location, styled for the trip rather than the studio.'
    },
    {
      id: 'product',
      title: 'Travel product',
      image: specProduct,
      tags: ['ugc', 'lifestyle'],
      body: 'Problem, product, relief — the classic UGC beat, played straight.'
    }
  ]
}

/* ------------------------------------------------------------- services */
export const services = [
  {
    id: 'ugc',
    icon: 'play',
    title: 'UGC content',
    tags: ['ugc'],
    body: 'Short-form videos created specifically for your brand social channels and paid social.'
  },
  {
    id: 'campaigns',
    icon: 'compass',
    title: 'Travel campaigns',
    tags: ['travel', 'destinations'],
    body: 'Destination storytelling and social-first travel content, from concept to delivery.'
  },
  {
    id: 'hotel',
    icon: 'key',
    title: 'Hotel & hospitality',
    tags: ['hotels'],
    body: 'Hotel stays, property storytelling and guest-experience content that makes a room feel booked.'
  },
  {
    id: 'destination',
    icon: 'pin',
    title: 'Destination campaigns',
    tags: ['destinations', 'travel'],
    body: 'Authentic destination-focused storytelling for tourism boards and regions.'
  },
  {
    id: 'fashion',
    icon: 'hanger',
    title: 'Lifestyle & Veg Food',
    tags: ['fashion', 'lifestyle'],
    body: 'Travel, veg food, accessories, beauty and lifestyle content shot on location.'
  },
  {
    id: 'social',
    icon: 'grid',
    title: 'Social media content',
    tags: ['ugc', 'lifestyle'],
    body: 'Ready-to-publish short-form video and visual assets, delivered on a schedule.'
  }
]

/* ------------------------------------------------------------- contact */
export const contact = {
  eyebrow: 'Contact',
  headline: "Let's create something people want to experience.",
  body:
    'Available for UGC, travel campaigns, hospitality collaborations, destination campaigns, veg food, lifestyle and social media content.',
  image: contactSunset,
  responseNote: 'Usually replies within a couple of days.'
}
