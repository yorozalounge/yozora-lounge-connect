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
  },
];
