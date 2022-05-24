import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import HeaderTableRefaral from "./Table/HeaderTableRefaral";
import RowTableRefaral from "./Table/RowTableRefaral";
import { useParams, useHistory } from "react-router-dom";
import {
  fetchReferralRewards,
  fetchReferralLinksById,
  sendReferral,
} from "./widgets/referals";
import { round } from "./widgets/round";
import { truncate, truncateCenter } from "./widgets/truncate";

function Referral() {
  const { id } = useParams();
  const history = useHistory();
  const [amountUsd, setAmountUsd] = useState(0);
  const [friendAmountUsd, setFriendAmountUsd] = useState(0);
  const [referalsList, setReferalsList] = useState([]);
  const [referral, setReferral] = useState({});
  const [sliderReferral, setSliderReferral] = useState("0% / 0%");
  useEffect(() => {
    const fn = async () => {
      if (!id) {
        changeReferral(0);
      } else {
        await fetchReferralRewards(id).then(async (result) => {
          await setReferalsList(result);
        });

        const referrals = await fetchReferralLinksById(id);

        setReferral(referrals);
        setSliderReferral(
          `${round(referrals.owner_percent, 1)}% / ${round(
            referrals.referral_percent,
            1
          )}%`
        );
      }
    };
    fn();
  }, [id]);

  useEffect(async () => {
    const yourAmount = await referalsList.reduce((acc, val) => {
      return parseInt(val.owner_reward_in_usd) + acc;
    }, 0);
    const friendAmount = await referalsList.reduce((acc, val) => {
      return parseInt(val.referral_reward_in_usd) + acc;
    }, 0);
    setAmountUsd(parseInt(yourAmount));
    setFriendAmountUsd(parseInt(friendAmount));
  }, [referalsList]);

  const changeReferral = async (value) => {
    await setSliderReferral(
      `${round(value.owner_percent, 1)}% / ${round(value.referral_percent, 1)}%`
    );
    await sendReferral({
      owner_percent: value.owner_percent,
      referral_percent: value.referral_percent,
    }).then((res) => {
      history.push(`/referral/${res.id}`);
      setReferral(res);
    });
  };
  return (
    <>
      <div className="referral">
        <div className="referral-instructions">
          <p>
            You earned <span>{amountUsd} $</span>
          </p>
          <p>
            Your friends earned <span>{friendAmountUsd} $</span>
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
                {truncate(referral.link_code, 16)} <i className="icon-copy" />
              </span>
            </p>
            <p className="referral-main__text">
              <span>Referal Link</span>
              <span
                onClick={() =>
                  navigator.clipboard.writeText(referral.link_owner)
                }
              >
                {truncateCenter(referral.link_owner, 16, 10)}{" "}
                <i className="icon-copy" />
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="referral-table__title">Referrals</h3>
          <div className="table-wrapper">
            <table className="table table-account">
              <HeaderTableRefaral />
              {referral &&
                referalsList &&
                referalsList.map((ref) => {
                  return (
                    <RowTableRefaral
                      key={ref.link}
                      referal={ref}
                      procent={`${round(referral.owner_percent)} / ${round(
                        referral.referral_percent
                      )}`}
                    />
                  );
                })}
            </table>
          </div>
        </div>

        <div className="footer-referal">
          <div className="footer-referal__instructions">
            <p>
              Available to claim <span>{friendAmountUsd} $</span>
            </p>
            <button className="button">Claim rewards</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Referral;
