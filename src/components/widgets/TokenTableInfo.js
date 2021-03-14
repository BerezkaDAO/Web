import React, { useState, useCallback, useRef } from "react";
import { ftmAmount, fmtDollatAmount } from "./format";
import TokenTableInfoRow from "./TokenTableInfoRow";
import TokenTableValueOutput from "./TokenTableValueOutput";

const TokenTableInfo = (props) => {
  const {
    tokens,
    walletAddress,
    web3,
    setGlobalTotal,
    profitAccumulator,
  } = props;

  const [total, setTotal] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  const totalAcc = useRef({
    tokens: [],
    total: 0,
  });

  const totalProfitAcc = useRef({
    tokens: [],
    total: 0,
  });

  const totalInvestedAcc = useRef({
    tokens: [],
    total: 0,
  });

  const totalAccumulator = useCallback((token, tokenTotal) => {
    const current = totalAcc.current;
    if (!current.tokens.includes(token)) {
      const newTotal = current.total + tokenTotal;
      const newTokens = [...current.tokens, token];
      totalAcc.current = {
        tokens: newTokens,
        total: newTotal,
      };
      setTotal(newTotal);
      setGlobalTotal(newTotal);
    }
  }, []);

  const totalProfitAccumulator = useCallback((token, tokenTotal) => {
    const current = totalProfitAcc.current;
    if (!current.tokens.includes(token)) {
      const newTotal = current.total + tokenTotal;
      const newTokens = [...current.tokens, token];
      totalProfitAcc.current = {
        tokens: newTokens,
        total: newTotal,
      };
      setTotalProfit(newTotal);
    }
  }, []);

  const totalInvestedAccumulator = useCallback((token, tokenTotal) => {
    const current = totalInvestedAcc.current;
    if (!current.tokens.includes(token)) {
      const newTotal = current.total + tokenTotal;
      const newTokens = [...current.tokens, token];
      totalInvestedAcc.current = {
        tokens: newTokens,
        total: newTotal,
      };
      setTotalInvested(newTotal);
    }
  }, []);

  const profitPercent =
    totalInvested == 0 ? 0 : (totalProfit / totalInvested) * 100;

  return (
    <table class="table table-account">
      <thead>
        <tr>
          <th rowSpan={2}>Product</th>
          <th rowSpan={2}>Token</th>
          <th rowSpan={2}>Amount</th>
          <th rowSpan={2}>Invested amount, USDT</th>
          <th rowSpan={2}>AVG purchase price</th>
          <th className="_large" colSpan={5}>
            Current value
          </th>
        </tr>
        <tr>
          <th>Token price</th>
          <th>Portfolio value, USDT</th>
          <th>Profit/Loss, USDT</th>
          <th>Profit/Loss, %</th>
          <th>APY %</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <TokenTableInfoRow
            key={token.address}
            token={token}
            walletAddress={walletAddress}
            //walletAddress={"0x108977FE1Cfd10f27D9591C33b8FE9733FD83D2C"}
            // walletAddress={"0x01fa075f621a61f2973cf44ebdb3b64153726b6f"}
            web3={web3}
            profitAccumulator={profitAccumulator}
            totalAccumulator={totalAccumulator}
            totalProfitAccumulator={totalProfitAccumulator}
            totalInvestedAccumulator={totalInvestedAccumulator}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>TOTAL</td>
          <td />
          <td />
          <td>
            <TokenTableValueOutput
              value={totalInvested}
              render={fmtDollatAmount}
            />
          </td>
          <td></td>
          <td></td>
          <td>
            <TokenTableValueOutput value={total} render={fmtDollatAmount} />
          </td>
          <td>
            <TokenTableValueOutput
              value={totalProfit}
              render={fmtDollatAmount}
            />
          </td>
          <td>
            <TokenTableValueOutput
              value={profitPercent}
              render={(value) => `${value.toFixed(2)}%`}
            />
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  );
};

export default TokenTableInfo;
