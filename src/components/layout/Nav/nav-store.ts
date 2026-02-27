import { atom } from "nanostores";

export const isNavExpand = atom(false);
export const toggleNav = () => isNavExpand.set(!isNavExpand.get());
