import { fetchCached } from "./cache";

export const fetchReferralRewards = async (id) => {
  const referral = await fetchCached(
    `/api/v1/public/referral_links/${id}/rewards`
  ).then((res) => res.data);
  return referral;
};

export const fetchReferralLinks = async () => {
  const referral = await fetchCached("/public/referral_links/").then(
    (res) => res.data
  );
  return referral;
};

export const fetchReferralLinksById = async (id) => {
  const referral = await fetchCached(`/public/referral_links/${id}`).then(
    (res) => res.data
  );
  return referral;
};
