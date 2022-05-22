import { fetchCached } from "./cache";

export const fetchReferralRewards = async (id) => {
  const referral = await fetchCached(
    `/api/v1/public/referral_links/${id}/rewards`
  ).then((res) => res.data);
  return referral;
};

export const fetchReferralLinks = async () => {
  const referral = await fetchCached("/api/v1/public/referral_links/").then(
    (res) => res.data
  );
  return referral;
};

export const fetchReferralLinksById = async (id) => {
  const referral = await fetchCached(
    `/api/v1/public/referral_links/${id}/`
  ).then((res) => res.data);
  return referral;
};

export const sendReferral = async (data) => {
  const referral = await fetch("/api/v1/public/referral_links/", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((json) => json);

  return referral;
};
