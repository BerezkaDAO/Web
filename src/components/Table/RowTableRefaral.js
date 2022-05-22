import React from "react";

const RowTableRefaral = (props) => {
  const { referal } = props;
  return (
    <tbody className="referal-table">
      <tr>
        <td>
          <div className="referal-table__first_block">
            <span>{referal.agent}</span>
            <i
              className="icon icon-copy"
              onClick={() => navigator.clipboard.writeText(referal.link)}
            />
          </div>
        </td>
        <td>{referal.friend_receive}</td>
        <td>
          <div className="referal-table__first_block">
            <span>{referal.referral}</span>
          </div>
        </td>
        <td>{referal.dao_name}</td>
        <td>{new Date(referal.deposit_dt).toLocaleString()}</td>
        <td>{referal.deposit_amount}</td>
        <td>{referal.deposit_price_in_usd}</td>
        <td>{new Date(referal.reward_dt).toLocaleString()}</td>
        <td>{referal.owner_reward_in_usd}</td>
        <td>{referal.referral_reward_in_usd}</td>
      </tr>
    </tbody>
  );
};

export default RowTableRefaral;
