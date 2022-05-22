import React from "react";
import { round } from "../widgets/round";

const RowTableRefaral = (props) => {
  const { referal, procent } = props;
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
        <td>{procent}</td>
        <td>
          <div className="referal-table__first_block">
            <span>{referal.referral}</span>
          </div>
        </td>
        <td>{referal.dao_name}</td>
        <td>{new Date(referal.deposit_dt).toLocaleString()}</td>
        <td>{referal.deposit_amount}</td>
        <td>{round(referal.deposit_price_in_usd, 2)}</td>
        <td>{new Date(referal.reward_dt).toLocaleString()}</td>
        <td>{round(referal.owner_reward_in_usd, 2)}</td>
        <td>{round(referal.referral_reward_in_usd, 2)}</td>
      </tr>
    </tbody>
  );
};

export default RowTableRefaral;
