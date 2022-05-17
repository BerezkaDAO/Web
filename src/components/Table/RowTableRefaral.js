import React from "react";

const RowTableRefaral = (props) => {
  const { referal } = props;
  return (
    <div className="referral-table__tr">
      <div className="referral-table__td">
        <div className="referral-table__td-row">
          <span>{referal.link}</span>
          <i
            className="icon icon-copy"
            onClick={() => navigator.clipboard.writeText(referal.link)}
          />
        </div>
      </div>
      <div className="referral-table__td">{referal.friend_receive}</div>
      <div className="referral-table__td">{referal.referal_friend}</div>
      <div className="referral-table__td">{referal.dao}</div>
      <div className="referral-table__td">{referal.deposit_date}</div>
      <div className="referral-table__td">{referal.amount}</div>
      <div className="referral-table__td">{referal.usd}</div>
      <div className="referral-table__td">{referal.reward_date}</div>
      <div className="referral-table__td">{referal.oru}</div>
      <div className="referral-table__td">{referal.rru}</div>
    </div>
  );
};

export default RowTableRefaral;
