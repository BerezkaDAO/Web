import { fetchDedupe } from "fetch-dedupe";
import Cache from "timed-cache";

const cache = new Cache({ defaultTtl: 30 * 1000 });

export const fetchCached = async (url, queryParams) => {
  const query =
    queryParams &&
    Object.keys(queryParams).length > 0 &&
    "?".concat(
      Object.keys(queryParams)
        .map(
          (e) =>
            `${encodeURIComponent(e)}=${encodeURIComponent(queryParams[e])}`
        )
        .join("&")
    );
  const finalUrl = url.concat(query || "");
  const cached = cache.get(finalUrl);
  if (cached) {
    return cached;
  }
  const fresh = fetchDedupe(finalUrl);
  cache.put(finalUrl, fresh);
  return fresh;
};
