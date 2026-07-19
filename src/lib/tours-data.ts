import heroImg from "@/assets/hero-sigiriya.jpg";
import ellaImg from "@/assets/ella.jpg";
import mirissaImg from "@/assets/mirissa.jpg";
import galleImg from "@/assets/galle.jpg";

export type TourDay = { day: number; title: string; body: string };

export type Tour = {
  slug: string;
  title: string;
  duration: string;
  group: string;
  price: string;
  priceFrom: number;
  image: string;
  gallery: string[];
  tag: string;
  body: string;
  longBody: string;
  includes: string[];
  excludes: string[];
  itinerary: TourDay[];
};

export const tours: Tour[] = [
  {
    slug: "classic-ceylon",
    title: "The Classic Ceylon",
    duration: "7 days",
    group: "Private",
    price: "$1,890",
    priceFrom: 1890,
    image: heroImg,
    gallery: [heroImg, ellaImg, galleImg],
    tag: "Bestseller",
    body: "Colombo → Sigiriya → Kandy → Nuwara Eliya → Yala → Galle. The essential first taste of Sri Lanka.",
    longBody:
      "Our signature itinerary threads together the island's greatest hits — the rock fortress of Sigiriya, the sacred city of Kandy, the misted tea country around Nuwara Eliya, a dawn safari at Yala, and the Dutch-fort seaside of Galle. Private driver-guide throughout.",
    includes: ["Boutique hotels & tea bungalows", "Private driver-guide", "All entrance fees", "Airport transfers", "Daily breakfast"],
    excludes: ["International flights", "Travel insurance", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival · Negombo", body: "Airport pickup, seaside dinner and a gentle first night to reset." },
      { day: 2, title: "Sigiriya", body: "Drive to the Cultural Triangle. Evening cave-temple visit at Dambulla." },
      { day: 3, title: "Sigiriya Rock", body: "Dawn ascent of the 5th-century rock fortress. Afternoon village cycle." },
      { day: 4, title: "Kandy", body: "Spice gardens en route, arrive for the Temple of the Tooth evening ceremony." },
      { day: 5, title: "Nuwara Eliya", body: "The world's most scenic rail journey through tea country." },
      { day: 6, title: "Yala Safari", body: "Transfer south for a dawn 4×4 safari — leopards, elephants, sloth bears." },
      { day: 7, title: "Galle · Departure", body: "Sunrise walk on the Fort ramparts, then transfer for your flight home." },
    ],
  },
  {
    slug: "highlands-tea-trails",
    title: "Highlands & Tea Trails",
    duration: "5 days",
    group: "Private",
    price: "$1,240",
    priceFrom: 1240,
    image: ellaImg,
    gallery: [ellaImg, heroImg, mirissaImg],
    tag: "Scenic",
    body: "Ride the world's most beautiful train route through Ella, Haputale and Nuwara Eliya. Sunrise over Adam's Peak.",
    longBody: "Five days at altitude — planter bungalows, first-class rail, mist-wreathed pluckers, and one very early morning on the pilgrim staircase up Adam's Peak.",
    includes: ["First-class rail seats", "Colonial planter bungalows", "Tea factory tour", "Guided hikes", "All meals"],
    excludes: ["International flights", "Alcoholic drinks"],
    itinerary: [
      { day: 1, title: "Kandy · Hatton", body: "Scenic drive up into the hills. Sunset from the bungalow verandah." },
      { day: 2, title: "Adam's Peak", body: "2am start for the sacred summit — dawn breaks over the shadow pyramid." },
      { day: 3, title: "Nuwara Eliya", body: "Little England: gardens, colonial post office, high-tea at the Grand." },
      { day: 4, title: "Ella by rail", body: "The iconic Nanu Oya → Ella train ride. Nine Arches Bridge at dusk." },
      { day: 5, title: "Ella · Departure", body: "Sunrise at Little Adam's Peak, then transfer down to the plains." },
    ],
  },
  {
    slug: "wildlife-whales",
    title: "Wildlife & Whales",
    duration: "6 days",
    group: "Small group ≤ 8",
    price: "$1,650",
    priceFrom: 1650,
    image: mirissaImg,
    gallery: [mirissaImg, heroImg, galleImg],
    tag: "Wild",
    body: "Leopards at Yala, elephants at Udawalawe, blue whales off Mirissa — the island's greatest animal encounters.",
    longBody: "A small-group safari for wildlife obsessives. Two national parks, a whale charter, and a resident naturalist guide throughout.",
    includes: ["Two dawn safaris", "Whale-watching charter", "Naturalist guide", "Beach resort stay", "All park fees"],
    excludes: ["International flights", "Optional second whale trip"],
    itinerary: [
      { day: 1, title: "Colombo · Udawalawe", body: "Transfer south. Evening game drive at Udawalawe for herds of elephants." },
      { day: 2, title: "Yala National Park", body: "Two safaris — dawn and dusk — in the leopard's high-density kingdom." },
      { day: 3, title: "Yala · Mirissa", body: "Morning drive to the south coast. Sundown catamaran cruise." },
      { day: 4, title: "Whale watching", body: "Dawn charter for blue and sperm whales in the Indian Ocean." },
      { day: 5, title: "Sinharaja", body: "Rainforest walk with an endemic-bird specialist." },
      { day: 6, title: "Departure", body: "Coastal breakfast, then back to Colombo." },
    ],
  },
  {
    slug: "southern-coast-escape",
    title: "Southern Coast Escape",
    duration: "4 days",
    group: "Private",
    price: "$980",
    priceFrom: 980,
    image: galleImg,
    gallery: [galleImg, mirissaImg, heroImg],
    tag: "Coast",
    body: "Galle Fort ramparts, Mirissa bays, Weligama surf and Tangalle sunsets — for lovers of the slow shore.",
    longBody: "Four unhurried days along the south — heritage hotels inside Galle Fort, a private surf lesson, sunset cruises, and long dinners of just-landed seafood.",
    includes: ["Fort heritage hotel", "Private surf lesson", "Sunset catamaran", "Seafood tasting"],
    excludes: ["International flights", "Spa treatments"],
    itinerary: [
      { day: 1, title: "Galle Fort", body: "Ramparts walk, gallery hop, cocktails on the bastion at sunset." },
      { day: 2, title: "Weligama surf", body: "Morning beginner lesson on a mellow point break. Lazy beach afternoon." },
      { day: 3, title: "Mirissa", body: "Sunrise coconut hill, sunset catamaran, seafood on the sand." },
      { day: 4, title: "Tangalle · Departure", body: "Empty crescent beach breakfast before returning to Colombo." },
    ],
  },
  {
    slug: "the-full-pearl",
    title: "The Full Pearl",
    duration: "14 days",
    group: "Private",
    price: "$3,650",
    priceFrom: 3650,
    image: heroImg,
    gallery: [heroImg, ellaImg, mirissaImg, galleImg],
    tag: "Grand tour",
    body: "The whole island — Cultural Triangle, hill country, east coast, safaris, and southern beaches — end to end.",
    longBody: "Two weeks of considered pace across every landscape — the ancient cities, the hill country, the east coast reefs, safari country, and the southern shore. Every hotel hand-picked, every logistic pre-solved.",
    includes: ["4- & 5-star properties", "Domestic flights", "Every experience above", "24/7 concierge"],
    excludes: ["International flights", "Travel insurance"],
    itinerary: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      title: ["Arrival", "Anuradhapura", "Sigiriya", "Polonnaruwa", "Kandy", "Nuwara Eliya", "Ella", "Udawalawe", "Yala", "Trincomalee", "Pigeon Island", "Galle", "Mirissa", "Departure"][i],
      body: "Curated experiences, private transfers, best-in-class stays for the night.",
    })),
  },
];

export function getTour(slug: string) {
  return tours.find((t) => t.slug === slug);
}
