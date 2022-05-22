import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import HeaderTableRefaral from "./Table/HeaderTableRefaral";
import RowTableRefaral from "./Table/RowTableRefaral";
import {
  fetchReferralRewards,
  fetchReferralLinksById,
  sendReferral,
} from "./widgets/referals";
import { round } from "./widgets/round";
import { truncate } from "./widgets/truncate";

function Referral(props) {
  const {
    claim = 0,
    match: {
      params: { id },
    },
  } = props;
  const [referalsList, setReferalsList] = useState([]);
  const [referral, setReferral] = useState({});
  const [sliderReferral, setSliderReferral] = useState("0% / 0%");
  useEffect(() => {
    const fn = async () => {
      const lists = await fetchReferralRewards(id);
      const referrals = await fetchReferralLinksById(id);
      setReferalsList(lists);
      setReferral(referrals);
      setSliderReferral(
        `${round(referrals.owner_percent, 1)}% / ${round(
          referrals.referral_percent,
          1
        )}%`
      );
    };
    fn();
  }, [id]);
  const changeReferral = async (value) => {
    await setSliderReferral(
      `${round(value.owner_percent, 1)}% / ${round(value.referral_percent, 1)}%`
    );
    await sendReferral({
      owner_percent: value.owner_percent,
      referral_percent: value.referral_percent,
    }).then((res) => {
      props.history.push(`/referral/${res.id}`);
      setReferral(res);
    });
  };
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
                {round(referral.owner_percent, 1)}% /{" "}
                {round(referral.referral_percent, 1)}%
              </span>
              <span>
                {round(referral.referral_percent, 1)}% /{" "}
                {round(referral.owner_percent, 1)}%
              </span>
            </div>
            <Slider changeReferral={(e) => changeReferral(e)} />
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
                {truncate(referral.link_code, 16)}{" "}
                <i className="icon icon-copy" />
              </span>
            </p>
            <p className="referral-main__text">
              <span>Referal Link</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(referral.link_owner)
                }
              >
                {truncate(referral.link_owner, 24)}{" "}
                <i className="icon icon-copy" />
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="referral-table__title">Referrals</h3>
          <div className="table-wrapper">
            <table className="table table-account">
              <HeaderTableRefaral />
              {referalsList.map((ref) => (
                <RowTableRefaral
                  key={ref.link}
                  referal={ref}
                  procent={`${round(referral.owner_percent)} / ${round(
                    referral.referral_percent
                  )}`}
                />
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
