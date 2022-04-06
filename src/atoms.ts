import { atom } from "recoil";

export const searchState = atom({
  key: "search",
  default: false,
});

export const offsetState = atom({
  key: "offset",
  default: 6,
});
