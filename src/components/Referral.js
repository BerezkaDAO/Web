import React from "react";
import Slider from "./Slider";

function Referral(props) {
  const { earned = 100, friendEarned = 50 } = props;
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
      </div>
    </>
  );
}

export default Referral;
