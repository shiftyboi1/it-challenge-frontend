// Static presentation details for merch products (images, colors, etc.)
// These are merged with backend product data (name, description, cost).

import TrikoB from "../assets/images/TrikoB.png";
import MikinaSM from "../assets/images/MikinaSM.png";
import MikinaB from "../assets/images/MikinaB.png";
import PoharG from "../assets/images/poharG.png";

export const MERCH_META = {
  tricko: {
    id: "tricko",
    image: TrikoB,
    fallback: { name: "Tričko HoloHome", shortDesc: "Kvalitné tričko s minimalistickým logom.", price: 24.9 },
  },
  "mikina-sm": {
    id: "mikina-sm",
    image: MikinaSM,
    fallback: { name: "Mikina Smartie", shortDesc: "Príjemná mikina s pohodlným strihom.", price: 49.9 },
  },
  "mikina-b": {
    id: "mikina-b",
    image: MikinaB,
    fallback: { name: "Mikina HoloHome", shortDesc: "Klasická biela mikina s logom.", price: 49.9 },
  },
  pohar: {
    id: "pohar",
    image: PoharG,
    fallback: { name: "Pohár HoloHome", shortDesc: "Sklenený pohár v troch farbách.", price: 12.9 },
  },
};

export const MERCH_IDS = new Set(Object.keys(MERCH_META));
