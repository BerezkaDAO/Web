import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import HeaderTableRefaral from "./Table/HeaderTableRefaral";
import RowTableRefaral from "./Table/RowTableRefaral";
import {
  fetchReferralRewards,
  fetchReferralLinksById,
} from "./widgets/referals";

const mockReferal = [
  {
    link: "https/Berezka... 4856897852124",
    friend_receive: "20/13",
    referal_friend: "48cs5a8as2s1as5astjhi478521ew24",
    dao: "Berezka FLEX DAO",
    deposit_date: "August 14, 2020 15:47:43",
    amount: "46203.9",
    usd: "1.5886555465",
    reward_date: "November 24, 2021 15:47:43",
    oru: "351.58865554652565",
    rru: 0,
  },
];

function Referral(props) {
  const {
    claim = 50,
    match: {
      params: { id },
    },
  } = props;
  console.log(id);
  const [referalsList, setReferalsList] = useState([]);
  const [referral, setReferral] = useState({});
  const [sliderReferral, setSliderReferral] = useState("0% / 0%");
  useEffect(() => {
    const fn = async () => {
      const lists = await fetchReferralRewards(id);
      const referrals = await fetchReferralLinksById(id);
      setReferalsList(lists);
      setReferral(referrals);
    };
    fn();
  }, []);
  console.log(referalsList, referral);
  return (
    <>
      <div className="referral">
        <div className="referral-instructions">
          <p>
            You earned <span>{100} $</span>
          </p>
          <p>
            Your friends earned <span>{50} $</span>
          </p>
          <hr />
          <div className="referral-instructions_subtitle">
            <p>Refer Friends. Earn Crypto Together.</p>
            <p>Earn up to 33% of friends carry fee.</p>
          </div>
        </div>
      </div>
      <div className="referral-main">
        <h3 className="referral__amount">Default Referral</h3>
        <div className="referral__block">
          <div className="referral__amount--data-slider">
            <div className="referral__slider-title">
              <span>You Receive</span> | <span>Friends Receive</span>
            </div>
            <div className="referral_slider-percent">
              <span>
                {parseInt(referral.owner_percent)}% /{" "}
                {parseInt(referral.referral_percent)}%
              </span>
              <span>
                {parseInt(referral.referral_percent)}% /{" "}
                {parseInt(referral.owner_percent)}%
              </span>
            </div>
            <Slider setSliderReferral={setSliderReferral} />
            <div className="referral__slider--input-value">
              <p>{sliderReferral}</p>
            </div>
          </div>
          <div className="referral-main__copy">
            <p className="referral-main__text">
              <span>Referal Code</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(referral.link_code)
                }
              >
                {referral.link_code} <i className="icon icon-copy" />
              </span>
            </p>
            <p className="referral-main__text">
              <span>Referal Link</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(referral.link_owner)
                }
              >
                {referral.link_owner} <i className="icon icon-copy" />
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="referral-table__title">Referrals</h3>
          <div className="table-wrapper">
            <table className="table table-account">
              <HeaderTableRefaral />
              {referalsList.map((referal) => (
                <RowTableRefaral key={referal.link} referal={referal} />
              ))}
            </table>
          </div>
        </div>

        <div className="footer-referal">
          <div className="footer-referal__instructions">
            <p>
              Available to claim <span>{claim} $</span>
            </p>
            <button className="button">Claim rewards</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Referral;
