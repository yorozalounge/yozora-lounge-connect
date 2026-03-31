import sophiaImg from "@/assets/talent-sophia.jpg";
import elenaImg from "@/assets/talent-elena.jpg";
import mariaImg from "@/assets/talent-maria.jpg";
import yukiImg from "@/assets/talent-yuki.jpg";
import camilleImg from "@/assets/talent-camille.jpg";
import jisooImg from "@/assets/talent-jisoo.jpg";
import anastasiaImg from "@/assets/talent-anastasia.jpg";
import valentinaImg from "@/assets/talent-valentina.jpg";
import naraImg from "@/assets/talent-nara.jpg";

export interface Talent {
  id: string;
  name: string;
  country: string;
  flag: string;
  languages: string[];
  rating: number;
  sessions: number;
  credits: number;
  image: string;
  online: boolean;
  bio: string;
  pricing: { duration: number; credits: number }[];
  reviews: { name: string; rating: number; text: string; date: string }[];
}

export const talents: Talent[] = [
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    country: "Singapore",
    flag: "🇸🇬",
    languages: ["English", "Mandarin", "Japanese"],
    rating: 4.9,
    sessions: 127,
    credits: 2000,
    image: sophiaImg,
    online: true,
    bio: "Born and raised in Singapore with roots in Shanghai, Sophia brings a captivating blend of Eastern grace and modern sophistication. A graduate of NUS with a passion for art history and classical piano, she is an effortless conversationalist who makes every session feel like an intimate evening at a world-class lounge.",
    pricing: [
      { duration: 20, credits: 2000 },
      { duration: 40, credits: 3800 },
      { duration: 60, credits: 5400 },
    ],
    reviews: [
      { name: "James W.", rating: 5, text: "Sophia is absolutely wonderful. Intelligent, warm, and genuinely engaging. The 40 minutes flew by.", date: "2026-03-15" },
      { name: "Michael T.", rating: 5, text: "A true class act. We talked about art, travel, and life — felt like catching up with an old friend.", date: "2026-03-02" },
      { name: "David L.", rating: 4, text: "Great conversationalist. Very attentive and made me feel at ease from the first minute.", date: "2026-02-18" },
    ],
  },
  {
    id: "elena-rossi",
    name: "Elena Rossi",
    country: "Italy",
    flag: "🇮🇹",
    languages: ["Italian", "English", "French"],
    rating: 5.0,
    sessions: 203,
    credits: 2500,
    image: elenaImg,
    online: true,
    bio: "Elena hails from a storied Milanese family with deep ties to fashion and the arts. With a background in luxury brand management and a lifelong love of opera, she embodies la dolce vita in every word. Her warmth, wit, and effortless elegance have made her one of Yozora Lounge's most sought-after talents.",
    pricing: [
      { duration: 20, credits: 2500 },
      { duration: 40, credits: 4800 },
      { duration: 60, credits: 7000 },
    ],
    reviews: [
      { name: "Robert K.", rating: 5, text: "Elena is perfection. Her stories about Milan and Italian culture are mesmerizing. Worth every credit.", date: "2026-03-20" },
      { name: "Alexander P.", rating: 5, text: "The most refined woman I've ever spoken with. Truly an extraordinary experience.", date: "2026-03-10" },
      { name: "Thomas H.", rating: 5, text: "Five stars is not enough. Elena makes you feel like the only person in the world.", date: "2026-02-28" },
    ],
  },
  {
    id: "maria-santos",
    name: "Maria Santos",
    country: "Brazil",
    flag: "🇧🇷",
    languages: ["Portuguese", "English", "Spanish"],
    rating: 4.8,
    sessions: 156,
    credits: 2200,
    image: mariaImg,
    online: true,
    bio: "Maria brings the warmth and vivacity of Rio de Janeiro to every conversation. A former dancer with Grupo Corpo and a psychology graduate from PUC-Rio, she has an extraordinary ability to read people and create genuine connection. Her infectious laughter and radiant energy light up every session.",
    pricing: [
      { duration: 20, credits: 2200 },
      { duration: 40, credits: 4200 },
      { duration: 60, credits: 6000 },
    ],
    reviews: [
      { name: "Chris B.", rating: 5, text: "Maria's energy is contagious. I was having a rough day and she completely turned it around.", date: "2026-03-18" },
      { name: "Daniel R.", rating: 5, text: "So much fun to talk to. She tells the best stories and her laugh is infectious.", date: "2026-03-05" },
      { name: "Steven M.", rating: 4, text: "Lovely personality, great listener. Would definitely book again.", date: "2026-02-22" },
    ],
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    languages: ["Japanese", "English"],
    rating: 4.9,
    sessions: 189,
    credits: 2800,
    image: yukiImg,
    online: false,
    bio: "Yuki is the embodiment of Japanese refinement — quiet strength wrapped in delicate beauty. Trained in the traditional arts of ikebana and tea ceremony in Kyoto, she later studied literature at Waseda University. Her sessions are an oasis of calm and mindful presence, a rare escape from the noise of modern life.",
    pricing: [
      { duration: 20, credits: 2800 },
      { duration: 40, credits: 5400 },
      { duration: 60, credits: 7800 },
    ],
    reviews: [
      { name: "William J.", rating: 5, text: "Yuki has a serene presence that is truly rare. Our conversation about Japanese literature was unforgettable.", date: "2026-03-12" },
      { name: "Andrew C.", rating: 5, text: "The most peaceful hour I've spent in months. Yuki is an absolute treasure.", date: "2026-02-25" },
      { name: "Peter N.", rating: 4, text: "Elegant and thoughtful. She listens deeply and responds with genuine insight.", date: "2026-02-10" },
    ],
  },
  {
    id: "camille-dubois",
    name: "Camille Dubois",
    country: "France",
    flag: "🇫🇷",
    languages: ["French", "English", "Spanish"],
    rating: 4.7,
    sessions: 98,
    credits: 2100,
    image: camilleImg,
    online: true,
    bio: "Camille is Parisian charm personified — playful, intelligent, and effortlessly chic. A Sorbonne graduate in philosophy who moonlights as a sommelier, she can discuss Sartre over Sancerre with equal passion. Her quick wit and coquettish humor make every session feel like a candlelit evening on the Left Bank.",
    pricing: [
      { duration: 20, credits: 2100 },
      { duration: 40, credits: 4000 },
      { duration: 60, credits: 5700 },
    ],
    reviews: [
      { name: "Henry F.", rating: 5, text: "Camille is everything you'd hope for from a French woman — charming, witty, brilliant.", date: "2026-03-14" },
      { name: "George L.", rating: 4, text: "Great conversation about wine and philosophy. Camille keeps things interesting.", date: "2026-02-20" },
      { name: "Mark D.", rating: 5, text: "Absolutely delightful. She made me laugh more than I have in weeks.", date: "2026-02-05" },
    ],
  },
  {
    id: "jisoo-park",
    name: "Jisoo Park",
    country: "South Korea",
    flag: "🇰🇷",
    languages: ["Korean", "English", "Japanese"],
    rating: 5.0,
    sessions: 215,
    credits: 3000,
    image: jisooImg,
    online: true,
    bio: "Jisoo is the crown jewel of Yozora Lounge. A former K-beauty brand ambassador with a degree in performing arts from KAIST, she combines K-pop charisma with intellectual depth. Her magnetic personality and impeccable style have earned her the highest rating on the platform — a distinction she maintains with effortless grace.",
    pricing: [
      { duration: 20, credits: 3000 },
      { duration: 40, credits: 5800 },
      { duration: 60, credits: 8500 },
    ],
    reviews: [
      { name: "Richard A.", rating: 5, text: "Jisoo is in a league of her own. The most captivating person I've ever spoken with.", date: "2026-03-22" },
      { name: "Kevin S.", rating: 5, text: "Worth every single credit. Jisoo is charming, funny, and genuinely kind.", date: "2026-03-08" },
      { name: "Brian T.", rating: 5, text: "I understand why she has a perfect rating. An unforgettable experience.", date: "2026-02-26" },
    ],
  },
  {
    id: "anastasia-volkov",
    name: "Anastasia Volkov",
    country: "Russia",
    flag: "🇷🇺",
    languages: ["Russian", "English", "French"],
    rating: 4.8,
    sessions: 142,
    credits: 2400,
    image: anastasiaImg,
    online: false,
    bio: "Anastasia carries the mystique of St. Petersburg in her soul — cultured, enigmatic, and breathtakingly poised. A classically trained ballet dancer who transitioned into fine art curation, she brings depth and elegance to every exchange. Conversations with her feel like wandering through the Hermitage at twilight.",
    pricing: [
      { duration: 20, credits: 2400 },
      { duration: 40, credits: 4600 },
      { duration: 60, credits: 6600 },
    ],
    reviews: [
      { name: "Paul W.", rating: 5, text: "Anastasia is like a character from a Russian novel — deep, beautiful, and unforgettable.", date: "2026-03-11" },
      { name: "Edward G.", rating: 4, text: "Her knowledge of art and ballet is incredible. A truly cultured woman.", date: "2026-02-15" },
      { name: "Jason K.", rating: 5, text: "Mesmerizing. Every moment with Anastasia feels like something out of a dream.", date: "2026-01-30" },
    ],
  },
  {
    id: "valentina-reyes",
    name: "Valentina Reyes",
    country: "Colombia",
    flag: "🇨🇴",
    languages: ["Spanish", "English", "Portuguese"],
    rating: 4.9,
    sessions: 167,
    credits: 2300,
    image: valentinaImg,
    online: true,
    bio: "Valentina is pure Colombian fire tempered with disarming tenderness. A journalist-turned-travel-writer from Medellín, she has stories from every continent and a gift for making anyone feel fascinating. Her passion for life, culture, and human connection is palpable in every word she speaks.",
    pricing: [
      { duration: 20, credits: 2300 },
      { duration: 40, credits: 4400 },
      { duration: 60, credits: 6300 },
    ],
    reviews: [
      { name: "Carlos M.", rating: 5, text: "Valentina is incredible. Her stories about traveling South America had me completely captivated.", date: "2026-03-19" },
      { name: "Lucas P.", rating: 5, text: "So passionate and genuine. Valentina makes you feel truly seen and heard.", date: "2026-03-03" },
      { name: "Ryan O.", rating: 4, text: "Great energy, wonderful storyteller. One of the best sessions I've had.", date: "2026-02-12" },
    ],
  },
  {
    id: "nara-srisai",
    name: "Nara Srisai",
    country: "Thailand",
    flag: "🇹🇭",
    languages: ["Thai", "English", "Mandarin"],
    rating: 4.7,
    sessions: 112,
    credits: 1800,
    image: naraImg,
    online: true,
    bio: "Nara radiates the gentle warmth of Thailand — soft-spoken yet magnetic, serene yet deeply engaging. With a background in hospitality management from Chulalongkorn University and years spent in Bangkok's luxury hotel scene, she has an innate ability to make every guest feel like royalty. Her calm presence is the perfect antidote to a hectic world.",
    pricing: [
      { duration: 20, credits: 1800 },
      { duration: 40, credits: 3400 },
      { duration: 60, credits: 4800 },
    ],
    reviews: [
      { name: "Nathan H.", rating: 5, text: "Nara has the most calming presence. I felt completely relaxed and at ease within minutes.", date: "2026-03-16" },
      { name: "Oliver B.", rating: 4, text: "Sweet, kind, and genuinely interested in conversation. A lovely experience.", date: "2026-02-28" },
      { name: "Sam T.", rating: 5, text: "Nara is a hidden gem. Don't let the lower credit price fool you — she's exceptional.", date: "2026-02-08" },
    ],
  },
];
