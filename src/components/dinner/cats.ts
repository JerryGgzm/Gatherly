export type CatId = "orange" | "tuxedo" | "gray" | "calico" | "white";

export type Accessory = "bandana" | "bowtie" | "sunglasses" | "bell" | "neckerchief";
export type Pattern = "tabby" | "tuxedo" | "fluffy" | "calico";

export type CatDef = {
  id: CatId;
  name: string;
  label: string;
  aria: string;
  pattern: Pattern;
  accessory: Accessory;
  colors: {
    base: string;
    dark: string;
    chest: string;
    paw: string;
    eye: string;
    whisker: string;
    tailTip?: string;
    patch?: string;
    acc: string;
    accDot?: string;
  };
  chair: string;
};

export const CATS: Record<CatId, CatDef> = {
  orange: {
    id: "orange",
    name: "Orange tabby",
    label: "The social one",
    aria: "Interact with the orange tabby cat",
    pattern: "tabby",
    accessory: "bandana",
    colors: { base: "#F4A443", dark: "#D46F22", chest: "#FFE9C7", paw: "#FFE0B0", eye: "#F2CF3D", whisker: "#242424", acc: "#2F6FD6", accDot: "#FFFFFF" },
    chair: "#3D7EFF",
  },
  tuxedo: {
    id: "tuxedo",
    name: "Tuxedo cat",
    label: "The skeptical one",
    aria: "Interact with the tuxedo cat",
    pattern: "tuxedo",
    accessory: "bowtie",
    colors: { base: "#2F2B2C", dark: "#2F2B2C", chest: "#FBF8F1", paw: "#FBF8F1", eye: "#B5D35A", whisker: "#FFFFFF", tailTip: "#FBF8F1", acc: "#E23B2E" },
    chair: "#FFD84D",
  },
  gray: {
    id: "gray",
    name: "Gray tabby",
    label: "The quiet one",
    aria: "Interact with the gray tabby cat",
    pattern: "tabby",
    accessory: "neckerchief",
    colors: { base: "#BDB5A8", dark: "#5F584E", chest: "#EEE9DF", paw: "#E6E0D4", eye: "#CBD65A", whisker: "#242424", acc: "#9368F7", accDot: "#F3E8FF" },
    chair: "#FF7BA9",
  },
  calico: {
    id: "calico",
    name: "Calico cat",
    label: "The chaotic one",
    aria: "Interact with the calico cat",
    pattern: "calico",
    accessory: "bell",
    colors: { base: "#FFF8EC", dark: "#4A3428", patch: "#F0892F", chest: "#FFFFFF", paw: "#FFF8EC", eye: "#E0C53A", whisker: "#242424", tailTip: "#F0892F", acc: "#F5C518" },
    chair: "#63C174",
  },
  white: {
    id: "white",
    name: "White cat",
    label: "The cool one",
    aria: "Interact with the white cat",
    pattern: "fluffy",
    accessory: "sunglasses",
    colors: { base: "#FCFAF5", dark: "#E3D9C9", chest: "#FFFFFF", paw: "#FCFAF5", eye: "#A6CF3F", whisker: "#B9AE9C", acc: "#2E7D4F", accDot: "#D6A437" },
    chair: "#9368F7",
  },
};

export const CAT_ORDER: CatId[] = ["orange", "tuxedo", "gray", "calico", "white"];

/** Scene geometry, in the 800×600 dinner-scene viewBox. */
export const VIEW_W = 800;
export const VIEW_H = 600;
export const TABLE = { cx: 400, cy: 318, rx: 240, ry: 112, depth: 26 };

export type Seat = {
  x: number;
  y: number;
  s: number;
  /** -1…1: how far the cat is turned toward the table centre (3/4 view). */
  turn: number;
  /** Local y of the front paws. Back seats rest them on the tabletop in front of the body. */
  pawY: number;
  pawDX: number;
  back: boolean;
  /** Place setting on the table for this seat. */
  plate: { x: number; y: number };
};

export const SEATS: Record<CatId, Seat> = {
  orange: { x: 400, y: 226, s: 0.92, turn: 0, pawY: 4, pawDX: 0, back: true, plate: { x: 400, y: 250 } },
  tuxedo: { x: 214, y: 274, s: 1, turn: 0.35, pawY: 2, pawDX: 4, back: true, plate: { x: 276, y: 286 } },
  gray: { x: 586, y: 274, s: 1, turn: -0.35, pawY: 2, pawDX: -4, back: true, plate: { x: 524, y: 286 } },
  calico: { x: 170, y: 440, s: 1.12, turn: 0.55, pawY: -46, pawDX: 12, back: false, plate: { x: 292, y: 362 } },
  white: { x: 630, y: 440, s: 1.12, turn: -0.55, pawY: -46, pawDX: -12, back: false, plate: { x: 508, y: 362 } },
};

export const USER_SEAT = { x: 400, y: 480, plate: { x: 400, y: 390 } };

export const headOf = (id: CatId) => {
  const s = SEATS[id];
  return { x: s.x, y: s.y - 104 * s.s };
};
