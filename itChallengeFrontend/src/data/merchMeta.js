// Static presentation details for merch products (images, colors, etc.)
// These are merged with backend product data (name, description, cost).

import Tričko from "../assets/images/Tričko.png";
import MikinaSmartie from "../assets/images/MikinaSmartie.png";
import Mikina from "../assets/images/Mikina.png";
import Pohár from "../assets/images/Pohár.png";

export const MERCH_META = {
  tricko: {
    id: "tricko",
    image: Tričko,
    fallback: { name: "Tričko HoloHome", shortDesc: "Kvalitné tričko s minimalistickým logom.", price: 24.9 },
  },
  "mikina-sm": {
    id: "mikina-sm",
    image: MikinaSmartie,
    fallback: { name: "Mikina Smartie", shortDesc: "Príjemná mikina s pohodlným strihom.", price: 49.9 },
  },
  "mikina-b": {
    id: "mikina-b",
    image: Mikina,
    fallback: { name: "Mikina HoloHome", shortDesc: "Klasická biela mikina s logom.", price: 49.9 },
  },
  pohar: {
    id: "pohar",
    image: Pohár,
    fallback: { name: "Pohár HoloHome", shortDesc: "Sklenený pohár v troch farbách.", price: 12.9 },
  },
};

export const MERCH_IDS = new Set(Object.keys(MERCH_META));
