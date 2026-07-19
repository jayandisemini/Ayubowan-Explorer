import heroImg from "@/assets/hero-sigiriya.jpg";
import ellaImg from "@/assets/ella.jpg";
import mirissaImg from "@/assets/mirissa.jpg";
import galleImg from "@/assets/galle.jpg";

export type Destination = {
  slug: string;
  name: string;
  region: string;
  image: string;
  tag: string;
  rating: number;
  body: string;
  bestTime: string;
  duration: string;
  highlights: string[];
  experiences: { title: string; description: string }[];
  gallery: string[];
  tips: string[];
};

export const destinations: Destination[] = [
  {
    slug: "sigiriya",
    name: "Sigiriya",
    region: "Cultural Triangle",
    image: heroImg,
    tag: "UNESCO Heritage",
    rating: 4.9,
    body: "The 5th-century rock fortress rises 200m from the jungle floor. Climb at dawn to walk the mirror wall and lion's paw terrace before the heat sets in.",
    bestTime: "January – April",
    duration: "1 – 2 days",
    highlights: ["Lion's Paw terrace", "Mirror Wall frescoes", "Water gardens", "Sunrise summit climb"],
    experiences: [
      { title: "Dawn Ascent", description: "Beat the crowds with a 5:30am gate entry and reach the summit as mist rolls off the jungle canopy." },
      { title: "Pidurangala Sister Rock", description: "The classic photographer's viewpoint — a 30-minute scramble rewards you with Sigiriya framed against the plains." },
      { title: "Village Cycle & Cook", description: "Pedal through paddy fields to a Sinhalese home for a hands-on curry lesson over a clay hearth." },
    ],
    gallery: [heroImg, ellaImg, galleImg],
    tips: ["Wear grippy shoes — the granite steps polish quickly.", "Carry 1.5L of water; there are no shops past the moat.", "Combine with Dambulla cave temples on the return."],
  },
  {
    slug: "ella",
    name: "Ella",
    region: "Hill Country",
    image: ellaImg,
    tag: "Tea Country",
    rating: 4.8,
    body: "Misty mountain village wrapped in emerald tea gardens. Ride the Podi Menike over Nine Arches Bridge, hike Little Adam's Peak, chase waterfalls at Ravana.",
    bestTime: "December – March",
    duration: "2 – 3 days",
    highlights: ["Nine Arches Bridge", "Little Adam's Peak", "Ravana Falls", "Kandy–Ella train"],
    experiences: [
      { title: "The Blue Train", description: "The Kandy–Ella line is often called the world's most beautiful rail journey — reserve a 2nd class window seat weeks ahead." },
      { title: "Tea Factory Tour", description: "Walk the withering lofts of a working Ceylon tea estate and cup a flight of single-origin BOPs." },
      { title: "Ella Rock Sunrise", description: "A 4-hour round-trip hike through eucalyptus groves and tea rows to a cliffside panorama." },
    ],
    gallery: [ellaImg, heroImg, mirissaImg],
    tips: ["Nights are cool — bring a light fleece.", "Book the train from Kandy, not Ella, for the best mountain-side seats.", "Leeches after rain: tuck socks into pants on jungle hikes."],
  },
  {
    slug: "mirissa",
    name: "Mirissa",
    region: "Southern Coast",
    image: mirissaImg,
    tag: "Whales · Surf",
    rating: 4.7,
    body: "Crescent bay of coconut palms and turquoise water. November–April brings blue whales within an hour's sail of the harbour.",
    bestTime: "November – April",
    duration: "2 – 4 days",
    highlights: ["Blue whale safari", "Coconut Tree Hill", "Secret Beach", "Sunset surf sessions"],
    experiences: [
      { title: "Blue Whale Expedition", description: "Depart the harbour at 6am with a marine biologist onboard — sightings of blue whales, sperm whales and spinner dolphins are near-daily in season." },
      { title: "Longboard at Weligama", description: "The neighbouring bay is Sri Lanka's kindest learner wave — gentle, chest-high, and warm year-round." },
      { title: "Parrotfish Dinner", description: "Pick your catch from ice at a beachfront grill and eat toes-in-sand under fairy lights." },
    ],
    gallery: [mirissaImg, galleImg, heroImg],
    tips: ["Choose whale operators that follow the 100m approach rule.", "Reef shoes help at Secret Beach's rocky entry.", "Book Coconut Tree Hill sunrise, not sunset — fewer crowds."],
  },
  {
    slug: "galle",
    name: "Galle",
    region: "Southern Coast",
    image: galleImg,
    tag: "Colonial Fort",
    rating: 4.8,
    body: "A 17th-century Dutch fort city on a rocky peninsula. Ramparts at sunset, boutique hotels in old spice merchant houses, and the Indian Ocean on three sides.",
    bestTime: "December – March",
    duration: "1 – 2 days",
    highlights: ["Fort ramparts", "Dutch Reformed Church", "Lighthouse & Flag Rock", "Boutique galleries"],
    experiences: [
      { title: "Rampart Walk at Golden Hour", description: "Circle the 3km sea wall as fishermen cast from the bastions and the lighthouse ignites." },
      { title: "Gem Atelier Visit", description: "Ceylon is world-famous for sapphires — visit a certified cutter's workshop inside the Fort." },
      { title: "Colonial Villa Stay", description: "Sleep in a restored Dutch merchant house with a plunge pool in a former courtyard." },
    ],
    gallery: [galleImg, mirissaImg, heroImg],
    tips: ["The Fort is walkable end-to-end in 20 minutes — leave the car outside.", "Friday evenings the ramparts fill with local families flying kites.", "Pair with Unawatuna beach 10 minutes east."],
  },
  {
    slug: "kandy",
    name: "Kandy",
    region: "Central Highlands",
    image: heroImg,
    tag: "Sacred City",
    rating: 4.7,
    body: "Home to the Temple of the Sacred Tooth Relic and the thundering Esala Perahera. A lakeside city cradled by forested hills.",
    bestTime: "January – April, July (Perahera)",
    duration: "1 – 2 days",
    highlights: ["Temple of the Tooth", "Kandy Lake circuit", "Royal Botanical Gardens", "Cultural dance show"],
    experiences: [
      { title: "Evening Puja", description: "The 6:30pm ceremony at Sri Dalada Maligawa is the temple at its most atmospheric — drummers, oil lamps, chanted sutras." },
      { title: "Peradeniya Gardens", description: "60 hectares of orchids, giant bamboo and a canopy of Javan fig — a shaded escape from the city." },
      { title: "Esala Perahera", description: "If your dates align in July/August, this ten-night procession of tusker elephants and fire dancers is unforgettable." },
    ],
    gallery: [heroImg, ellaImg, galleImg],
    tips: ["Modest dress at the temple — shoulders and knees covered.", "Perahera grandstand tickets sell out months ahead.", "Kandy is the natural launchpad for the Ella train."],
  },
  {
    slug: "yala",
    name: "Yala",
    region: "Deep South",
    image: ellaImg,
    tag: "Safari",
    rating: 4.6,
    body: "The highest density of leopards on Earth. Elephants, sloth bears, painted storks — dawn jeep safaris through scrub, lagoon, and coastal dune.",
    bestTime: "February – July",
    duration: "1 – 2 days",
    highlights: ["Leopard tracking", "Elephant herds at Buttawa", "Coastal dune drives", "Sloth bear sightings"],
    experiences: [
      { title: "Full-Day Block 1 Safari", description: "The park's leopard heartland — a private naturalist and packed breakfast maximise dawn and dusk activity windows." },
      { title: "Luxury Tented Camp", description: "Sleep in canvas suites with copper baths on the park's edge; jackals and peafowl at your veranda." },
      { title: "Kataragama Pilgrimage", description: "Combine safari with a visit to the multi-faith shrine town on Yala's western boundary." },
    ],
    gallery: [ellaImg, heroImg, mirissaImg],
    tips: ["Park closes September for animal welfare — plan around it.", "Neutral colours only — bright clothing spooks wildlife.", "Book a private (not shared) jeep for photography."],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
