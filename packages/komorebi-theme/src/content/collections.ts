import { blogLoader, specialLoader, type KomorebiCollectionsOptions } from "./loaders";
import { blogSchema, specialSchema } from "./schema";

export function blogConfig(options: KomorebiCollectionsOptions = {}) {
  return {
    loader: blogLoader(options),
    schema: blogSchema(),
  };
}

export function specialConfig(options: KomorebiCollectionsOptions = {}) {
  return {
    loader: specialLoader(options),
    schema: specialSchema(),
  };
}
