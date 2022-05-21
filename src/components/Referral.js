import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import HeaderTableRefaral from "./Table/HeaderTableRefaral";
import RowTableRefaral from "./Table/RowTableRefaral";
import { fetchReferralLinks } from "./widgets/referals";

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
  const { earned = 100, friendEarned = 50, claim = 50 } = props;
  const [referals, setReferals] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const result = await fetchReferralLinks();
      setReferals(result);
    };
    fn();
  }, []);
  console.log(referals);
  return (
    <>
      <div className="referral">
        <div className="referral-instructions">
          <p>
            You earned <span>{earned} $</span>
          </p>
          <p>
            Your friends earned <span>{friendEarned} $</span>
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
              <span>33% / 0%</span>
              <span>0% / 33%</span>
            </div>
            <Slider />
            <div className="referral__slider--input-value">
              <p>20% / 13%</p>
            </div>
          </div>
          <div className="referral-main__copy">
            <p className="referral-main__text">
              <span>Referal Code</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText("test 4856897852124")
                }
              >
                4856897852124 <i className="icon icon-copy" />
              </span>
            </p>
            <p className="referral-main__text">
              <span>Referal Link</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText("https/Berezka...4856897852124")
                }
              >
                https/Berezka...4856897852124 <i className="icon icon-copy" />
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="referral-table__title">Referrals</h3>
          <div className="table-wrapper">
            <table className="table table-account">
              <HeaderTableRefaral />
              {mockReferal.map((referal) => (
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
