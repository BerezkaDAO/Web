import { fetchDedupe } from "fetch-dedupe";
import Cache from "timed-cache";

const cache = new Cache({ defaultTtl: 30 * 1000 });

export const fetchCached = async (url) => {
  const cached = cache.get(url);
  if (cached) {
    return cached;
  }
  const fresh = fetchDedupe(url);
  cache.put(url, fresh);
  return fresh;
};
