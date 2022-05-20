import React from "react";

const RowTableRefaral = (props) => {
  const { referal } = props;
  return (
    <tbody className="referal-table">
      <tr>
        <td>
          <div>
            <span>{referal.link}</span>
            <i
              className="icon icon-copy"
              onClick={() => navigator.clipboard.writeText(referal.link)}
            />
          </div>
        </td>
        <td>{referal.friend_receive}</td>
        <td>
          <span>{referal.referal_friend}</span>
        </td>
        <td>{referal.dao}</td>
        <td>{referal.deposit_date}</td>
        <td>{referal.amount}</td>
        <td>{referal.usd}</td>
        <td>{referal.reward_date}</td>
        <td>{referal.oru}</td>
        <td>{referal.rru}</td>
      </tr>
    </tbody>
  );
};

export default RowTableRefaral;
