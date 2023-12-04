import React from "react";
import { tokenInfo } from "./data/tokens";
import { admins } from "./data/admin";

import TokenAmount from "./widgets/TokenAmount";
import TokenPrice from "./widgets/TokenPrice";
import APY from "./widgets/APY";
import TokenAmountGraph from "./widgets/TokenAmountGraph";
import PortfolioParts from "./widgets/PortfolioParts";
import TokenCarry from "./widgets/TokenCarry";
import { useBlastData } from "./widgets/useBlastData";

export function TokenDashboardBlastDao(props) {
  const token = props.match.params.id;
  const { web3Global, address } = props;
  const tokenAddress = tokenInfo[token].address;
  const isLegacy = tokenInfo[token].isLegacy;
  const isAdmin = address && admins.includes(address.toLowerCase());

  const { blastTotal, isLoading } = useBlastData(address, token);

  return (
    <>
      <div class="info-carry">
        Accumulated Carry:{" "}
        <TokenCarry
          tokenAddress={tokenAddress}
          dollarSeparator=" "
          separator=" "
          isLegacy={isLegacy}
          isAdmin={isAdmin}
        />
      </div>
      <div className="info-list grid">
        <div className="info-main grid-col-4 grid-md-12">
          <div className="info-main__header">
            <div className="info-main__title">Net portfolio, ETH</div>
            <div className="info-main__icon">
              <i className="icon icon-chart" />
            </div>
          </div>
          <div className="info-main__value">
            {isLoading ? "..." : blastTotal.eth?.toFixed(2)}
          </div>
        </div>
        <div className={`info-main grid-col-4 grid-md-12`}>
          <div className="info-main__header">
            <div className="info-main__title">Net portfolio, USD</div>
            <div className="info-main__icon">
              <i className="icon icon-eye" />
            </div>
          </div>
          <div className="info-main__value">
            {isLoading ? (
              "..."
            ) : (
              <>
                {`$${" "}`}
                {blastTotal.usd
                  ?.toFixed(0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " " || ".")}
              </>
            )}
          </div>
        </div>
        <div className={`info-main grid-col-4 grid-md-12`}>
          <div className="info-main__header">
            <div className="info-main__title">Blast points</div>
            <div className="info-main__icon">
              <i className="icon icon-arrows" />
            </div>
          </div>
          <div className="info-main__value">
            {isLoading
              ? "..."
              : blastTotal.points
                  ?.toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " " || ".")}
          </div>
        </div>

        <div className="info-general grid-col-4 grid-lg-6 grid-md-12">
          <div className="info-general__header">
            <div className="info-general__title">Liquidity pools</div>
          </div>
          <div className="info-general__content">
            <PortfolioParts tokenAddress={tokenAddress} web3={web3Global} />
          </div>
        </div>
        <div className="info-general _wide grid-col-8 grid-lg-6 grid-md-12">
          <div className="info-general__header">
            <div className="info-general__title">Portfolio Value, USD</div>
            <div className="info-general__menu">
              <div className="dropdown">
                <a className="dropdown__button" href>
                  <i className="icon icon-menu2" />
                </a>
                <div className="dropdown__menu">
                  <a className="dropdown__menu-item" href />
                </div>
              </div>
            </div>
          </div>
          <div className="info-general__content">
            <TokenAmountGraph tokenAddress={tokenAddress} isLegacy={isLegacy} />
          </div>
        </div>
      </div>
    </>
  );
}
