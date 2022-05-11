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
        <div>
          <Slider />
        </div>
      </div>
    </>
  );
}

export default Referral;
