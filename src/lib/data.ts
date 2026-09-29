export type ThemeId =
  | "startups"
  | "music"
  | "film"
  | "travel"
  | "food"
  | "tech"
  | "books"
  | "art"
  | "fitness"
  | "life";

export type Theme = {
  id: ThemeId;
  label: string;
  icon: string;
  color: string;
  tilt: number;
};

export const THEMES: Theme[] = [
  { id: "startups", label: "Startups", icon: "🚀", color: "#FF6B35", tilt: -2 },
  { id: "music", label: "Music", icon: "🎧", color: "#9368F7", tilt: 1.5 },
  { id: "film", label: "Film", icon: "🎬", color: "#3D7EFF", tilt: -1 },
  { id: "travel", label: "Travel", icon: "🧳", color: "#63C174", tilt: 2 },
  { id: "food", label: "Food", icon: "🍜", color: "#FFD84D", tilt: -1.5 },
  { id: "tech", label: "Tech", icon: "💻", color: "#3D7EFF", tilt: 1 },
  { id: "books", label: "Books", icon: "📚", color: "#FF7BA9", tilt: -2 },
  { id: "art", label: "Art", icon: "🎨", color: "#9368F7", tilt: 1.5 },
  { id: "fitness", label: "Fitness", icon: "👟", color: "#63C174", tilt: -1 },
  { id: "life", label: "Life", icon: "☕", color: "#FF6B35", tilt: 2 },
];

export const themeById = (id: ThemeId) => THEMES.find((t) => t.id === id)!;

export type LocationId = "slu" | "udistrict" | "capitolhill" | "bellevue";

export type Location = {
  id: LocationId;
  name: string;
  short: string;
  image: string;
  tagline: string;
  accent: string;
  hoverLine: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "slu",
    name: "South Lake Union",
    short: "SLU",
    image: "/art/area-slu-lakeunion.png",
    tagline: "Seaplanes, docks and glass towers.",
    accent: "#3D7EFF",
    hoverLine: "Logging off early tonight?",
  },
  {
    id: "udistrict",
    name: "University District",
    short: "U District",
    image: "/art/area-udistrict.png",
    tagline: "Cherry blossoms and big ideas.",
    accent: "#63C174",
    hoverLine: "Dinner after class?",
  },
  {
    id: "capitolhill",
    name: "Capitol Hill",
    short: "Capitol Hill",
    image: "/art/area-capitolhill.png",
    tagline: "Neon, records, late conversations.",
    accent: "#9368F7",
    hoverLine: "The night is young.",
  },
  {
    id: "bellevue",
    name: "Bellevue",
    short: "Bellevue",
    image: "/art/area-bellevue-park.png",
    tagline: "Glass towers, a big green park, a lakeside marina.",
    accent: "#FF6B35",
    hoverLine: "Eastside dinner, anyone?",
  },
];

export const locationById = (id: LocationId) => LOCATIONS.find((l) => l.id === id)!;

export type BudgetId = "casual" | "comfortable" | "treat";

export const BUDGETS: {
  id: BudgetId;
  label: string;
  range: string;
  sign: string;
  art: string;
  color: string;
}[] = [
  { id: "casual", label: "Casual", range: "$15–30", sign: "$", art: "🍜🍔", color: "#FFD84D" },
  { id: "comfortable", label: "Comfortable", range: "$30–50", sign: "$$", art: "🥘🥗", color: "#63C174" },
  { id: "treat", label: "Treat Yourself", range: "$50–100", sign: "$$$", art: "🍷🍽️", color: "#9368F7" },
];

export const budgetById = (id: BudgetId) => BUDGETS.find((b) => b.id === id)!;

export type Dinner = {
  id: string;
  weekday: "THU" | "SAT";
  dayLabel: string;
  month: string;
  day: number;
  location: LocationId;
  themes: ThemeId[];
  budget: BudgetId;
  seatsTaken: number;
  /** Started by the user from an empty night. */
  created?: boolean;
};

export type Night = Pick<Dinner, "weekday" | "dayLabel" | "month" | "day">;

export const DINNERS: Dinner[] = [
  { id: "thu-oct1-ud", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 1, location: "udistrict", themes: ["books", "tech", "art"], budget: "casual", seatsTaken: 6 },
  { id: "thu-oct1-slu", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 1, location: "slu", themes: ["startups", "fitness", "food"], budget: "comfortable", seatsTaken: 6 },
  { id: "sat-oct3-cap", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 3, location: "capitolhill", themes: ["music", "life", "food"], budget: "casual", seatsTaken: 4 },
  { id: "sat-oct3-bel", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 3, location: "bellevue", themes: ["tech", "travel", "life"], budget: "treat", seatsTaken: 2 },
  { id: "thu-oct8-slu", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 8, location: "slu", themes: ["tech", "startups", "travel"], budget: "comfortable", seatsTaken: 4 },
  { id: "thu-oct8-cap", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 8, location: "capitolhill", themes: ["music", "art", "film"], budget: "casual", seatsTaken: 2 },
  { id: "sat-oct10-cap", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 10, location: "capitolhill", themes: ["startups", "tech", "life"], budget: "comfortable", seatsTaken: 3 },
  { id: "sat-oct10-ud", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 10, location: "udistrict", themes: ["books", "film", "food"], budget: "casual", seatsTaken: 1 },
  { id: "sat-oct10-bel", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 10, location: "bellevue", themes: ["food", "travel", "fitness"], budget: "treat", seatsTaken: 5 },
  { id: "thu-oct15-ud", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 15, location: "udistrict", themes: ["tech", "books", "life"], budget: "casual", seatsTaken: 2 },
  { id: "thu-oct15-bel", weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 15, location: "bellevue", themes: ["startups", "fitness", "life"], budget: "comfortable", seatsTaken: 3 },
  { id: "sat-oct17-slu", weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 17, location: "slu", themes: ["film", "music", "food"], budget: "treat", seatsTaken: 0 },
];

export const dinnerById = (id: string) => DINNERS.find((d) => d.id === id);

export const SEATS_PER_TABLE = 6;

export const nightKey = (d: Pick<Dinner, "month" | "day">) => `${d.month}-${d.day}`;

/** Open booking nights: Thursdays and Saturdays, whether or not anyone has started a table yet. */
export const NIGHTS: Night[] = [
  { weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 1 },
  { weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 3 },
  { weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 8 },
  { weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 10 },
  { weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 15 },
  { weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 17 },
  { weekday: "THU", dayLabel: "Thursday", month: "OCT", day: 22 },
  { weekday: "SAT", dayLabel: "Saturday", month: "OCT", day: 24 },
];

export const nightByKey = (k: string) => NIGHTS.find((n) => nightKey(n) === k);

const titleMonth = (m: string) => m.charAt(0) + m.slice(1).toLowerCase();

/** "Sat · Oct 10 · Capitol Hill" */
export const dinnerStub = (d: Dinner) => `${titleMonth(d.weekday)} · ${titleMonth(d.month)} ${d.day} · ${locationById(d.location).short}`;

export const nightLabel = (n: Night) => `${titleMonth(n.weekday)} · ${titleMonth(n.month)} ${n.day}`;

export const SOCIAL_INTENTS = [
  { id: "friends", label: "Meet new friends", icon: "🤝" },
  { id: "circle", label: "Expand my social circle", icon: "🫧" },
  { id: "outside", label: "Meet people outside my industry", icon: "🧭" },
  { id: "inside", label: "Meet people in my industry", icon: "🧰" },
  { id: "activity", label: "Find activity partners", icon: "🚴" },
  { id: "newcomers", label: "Meet other newcomers", icon: "📦" },
  { id: "conversations", label: "Have interesting conversations", icon: "💬" },
  { id: "romantic", label: "Open to romantic connections", icon: "✨" },
];

export type QuestionOption = {
  id: string;
  label: string;
  art: string;
};

export type Question = {
  id: string;
  dimension: string;
  prompt: string;
  options: QuestionOption[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    dimension: "Social energy",
    prompt: "At a table full of strangers, what are you usually doing first?",
    options: [
      { id: "start", label: "Starting the conversation", art: "👋" },
      { id: "join", label: "Joining in naturally", art: "🫶" },
      { id: "listen", label: "Listening first, warming up", art: "🥤" },
    ],
  },
  {
    id: "q2",
    dimension: "Social energy",
    prompt: "After a big night out, you feel…",
    options: [
      { id: "charged", label: "Charged up — what's next?", art: "⚡" },
      { id: "happy", label: "Happy but ready for bed", art: "😌" },
      { id: "drained", label: "Like I need a quiet Sunday", art: "🛋️" },
    ],
  },
  {
    id: "q3",
    dimension: "Conversation depth",
    prompt: "Which kind of dinner conversation do you enjoy most?",
    options: [
      { id: "light", label: "Light and fun", art: "🎈" },
      { id: "deep", label: "Deep and thoughtful", art: "🌊" },
      { id: "practical", label: "Practical, career-y", art: "🧭" },
      { id: "mix", label: "A bit of everything", art: "🥗" },
    ],
  },
  {
    id: "q4",
    dimension: "Conversation depth",
    prompt: "Someone asks “what are you working on lately?” You…",
    options: [
      { id: "job", label: "Talk about my job", art: "💼" },
      { id: "side", label: "Talk about a side project", art: "🛠️" },
      { id: "life", label: "Talk about life stuff", art: "🌱" },
    ],
  },
  {
    id: "q5",
    dimension: "Social novelty",
    prompt: "Who would you rather meet?",
    options: [
      { id: "similar", label: "People similar to me", art: "🪞" },
      { id: "different", label: "People very different from me", art: "🌈" },
      { id: "between", label: "Somewhere in between", art: "⚖️" },
    ],
  },
  {
    id: "q6",
    dimension: "Social novelty",
    prompt: "A friend suggests a restaurant you've never heard of.",
    options: [
      { id: "yes", label: "Say less, I'm in", art: "🚀" },
      { id: "menu", label: "Let me peek at the menu", art: "🔍" },
      { id: "usual", label: "Can we do the usual spot?", art: "🏠" },
    ],
  },
  {
    id: "q7",
    dimension: "Group role",
    prompt: "In a group, you're usually…",
    options: [
      { id: "storyteller", label: "The storyteller", art: "📖" },
      { id: "listener", label: "The listener", art: "👂" },
      { id: "connector", label: "The connector", art: "🔗" },
      { id: "asker", label: "The question asker", art: "❓" },
    ],
  },
  {
    id: "q8",
    dimension: "Group role",
    prompt: "The conversation hits a lull. You…",
    options: [
      { id: "question", label: "Throw out a fun question", art: "🎲" },
      { id: "story", label: "Tell a quick story", art: "🎤" },
      { id: "wait", label: "Let someone else fill it", art: "🍵" },
    ],
  },
  {
    id: "q9",
    dimension: "Lifestyle",
    prompt: "Your ideal Saturday looks like…",
    options: [
      { id: "outdoors", label: "A hike or a long bike ride", art: "🥾" },
      { id: "city", label: "Wandering the city, cafés", art: "☕" },
      { id: "create", label: "Making something at home", art: "🎨" },
      { id: "social", label: "Brunch, then more plans", art: "🥂" },
    ],
  },
  {
    id: "q10",
    dimension: "Lifestyle",
    prompt: "How does your week usually feel?",
    options: [
      { id: "steady", label: "Steady 9–5 rhythm", art: "🕘" },
      { id: "chaotic", label: "Chaotic but fun", art: "🌪️" },
      { id: "flexible", label: "Flexible, I make my own hours", art: "🪁" },
    ],
  },
  {
    id: "q11",
    dimension: "Lifestyle",
    prompt: "Late nights are…",
    options: [
      { id: "love", label: "Where the magic happens", art: "🌙" },
      { id: "sometimes", label: "Fun once in a while", art: "🌆" },
      { id: "early", label: "Not my thing — early bird", art: "🌅" },
    ],
  },
  {
    id: "q12",
    dimension: "Life stage",
    prompt: "Which best describes where you are right now?",
    options: [
      { id: "student", label: "Student / grad student", art: "🎓" },
      { id: "early", label: "Early career", art: "🌱" },
      { id: "mid", label: "Mid career", art: "🌳" },
      { id: "founder", label: "Founder / building something", art: "🛠️" },
      { id: "transition", label: "Career transition", art: "🔀" },
    ],
  },
  {
    id: "q13",
    dimension: "Life stage",
    prompt: "How long have you been in Seattle?",
    options: [
      { id: "new", label: "Just got here", art: "📦" },
      { id: "few", label: "A couple of years", art: "🌧️" },
      { id: "local", label: "Basically a local", art: "🗻" },
    ],
  },
  {
    id: "q14",
    dimension: "Group behavior",
    prompt: "What makes a dinner great for you?",
    options: [
      { id: "laugh", label: "Laughing a lot", art: "😂" },
      { id: "learn", label: "Learning something new", art: "💡" },
      { id: "connect", label: "Feeling really connected", art: "🫂" },
    ],
  },
  {
    id: "q15",
    dimension: "Personality",
    prompt: "Do you know your MBTI? (Totally optional flavor.)",
    options: [
      { id: "E", label: "Starts with E", art: "🔆" },
      { id: "I", label: "Starts with I", art: "🌙" },
      { id: "unsure", label: "No idea / don't care", art: "🤷" },
    ],
  },
];

export const OPTIONAL_QUESTIONS: Question[] = [
  {
    id: "o1",
    dimension: "Travel",
    prompt: "Your travel style?",
    options: [
      { id: "plan", label: "Spreadsheet itinerary", art: "🗂️" },
      { id: "wing", label: "Wing it completely", art: "🪂" },
      { id: "slow", label: "One city, stay long", art: "🏡" },
    ],
  },
  {
    id: "o2",
    dimension: "Values",
    prompt: "Which matters most to you in friendships?",
    options: [
      { id: "honesty", label: "Honesty", art: "🪞" },
      { id: "fun", label: "Fun", art: "🎉" },
      { id: "loyal", label: "Showing up", art: "🧡" },
    ],
  },
  {
    id: "o3",
    dimension: "Social habits",
    prompt: "Texting back?",
    options: [
      { id: "instant", label: "Instantly", art: "⚡" },
      { id: "day", label: "Within a day", art: "📬" },
      { id: "voice", label: "I'll call you instead", art: "📞" },
    ],
  },
];

export type Persona = {
  id: string;
  name: string;
  background: string;
  interests: ThemeId[];
  bubble: string;
  age: number;
  color: string;
};

export const PERSONAS: Persona[] = [
  { id: "maya", name: "Maya", background: "Designer", interests: ["film", "travel", "art"], bubble: "Into indie films", age: 27, color: "#FFD84D" },
  { id: "leo", name: "Leo", background: "Founder", interests: ["startups", "tech", "travel"], bubble: "Building something", age: 31, color: "#3D7EFF" },
  { id: "priya", name: "Priya", background: "Researcher", interests: ["books", "tech", "film"], bubble: "New to Seattle", age: 25, color: "#9368F7" },
  { id: "sam", name: "Sam", background: "Healthcare", interests: ["travel", "fitness", "food"], bubble: "Always planning a trip", age: 29, color: "#63C174" },
  { id: "june", name: "June", background: "Engineer", interests: ["music", "tech", "startups"], bubble: "Plays bass on weekends", age: 26, color: "#FF7BA9" },
  { id: "diego", name: "Diego", background: "Grad student", interests: ["food", "books", "life"], bubble: "Makes a mean pasta", age: 24, color: "#FF6B35" },
];

export const personaById = (id: string) => PERSONAS.find((p) => p.id === id)!;

export const USER_COLOR = "#FF6B35";

export const TABLEMATE_IDS = ["maya", "leo", "priya", "sam", "june"];

export const SHARED_INTERESTS: ThemeId[] = ["travel", "film", "startups"];

export const RESTAURANT = {
  name: "Tavolo Rosso",
  cuisine: "Italian · Shared plates",
  neighborhood: "Capitol Hill",
  address: "1520 E Olive Way, Seattle",
  time: "7:00 PM",
  price: "$$",
  noise: "Quiet",
  conversation: 4,
  splitFriendly: true,
  vegetarian: "Good",
  spice: "Mild options",
  art: "🍝🕯️",
};

export const CONVERSATION_PROMPTS = [
  "What's something you changed your mind about in the last three years?",
  "What's the best meal you've had in Seattle so far?",
  "If you could master one skill overnight, what would it be?",
  "What's a small thing that made your week better?",
  "What would you do with a completely free Tuesday?",
  "What's a hobby you'd pick up if time and money didn't matter?",
  "Which place in the world do you want to go back to?",
];

export const TABLE_CHALLENGES = [
  "Find one thing everyone at this table has in common.",
  "Everyone shares the last photo on their camera roll (only if you're brave).",
  "Agree on one Seattle spot the whole table should visit next.",
];

export const REPORT_REASONS = [
  "Harassment",
  "Discrimination",
  "Aggressive behavior",
  "Inappropriate sexual behavior",
  "Scam / solicitation",
  "Unsafe behavior",
  "Other",
];

export const MATCHING_COPY = [
  "Looking for people with something to talk about.",
  "Mixing shared interests with unexpected perspectives.",
  "Checking everyone's dinner preferences.",
  "Almost there.",
];
