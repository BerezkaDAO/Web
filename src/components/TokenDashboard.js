import React from "react";
import { tokenInfo } from "./data/tokens";
import { admins } from "./data/admin";

import TokenAmount from "./widgets/TokenAmount";
import TokenPrice from "./widgets/TokenPrice";
import APY from "./widgets/APY";
import TokenPriceGraph from "./widgets/TokenPriceGraph";
import TokenAmountGraph from "./widgets/TokenAmountGraph";
import PortfolioPartsGraph from "./widgets/PortfolioPartsGraph";
import PortfolioParts from "./widgets/PortfolioParts";
import TokenCarry from "./widgets/TokenCarry";

function TokenDashboard(props) {
  const token = props.match.params.id;
  const { web3Global, address } = props;
  const tokenAddress = tokenInfo[token].address;
  const isLegacy = tokenInfo[token].isLegacy;
  const enableCarry = tokenInfo[token].enableCarry;
  const isAdmin = address && admins.includes(address.toLowerCase());

  return (
    <div className="info-list grid">
      <div className="info-main grid-col-4 grid-md-12">
        <div className="info-main__header">
          <div className="info-main__title">
            {tokenInfo[token].tableName} token price, USD
          </div>
          <div className="info-main__icon">
            <i className="icon icon-chart" />
          </div>
        </div>
        <div className="info-main__value">
          <TokenAmount tokenAddress={tokenAddress} isLegacy={isLegacy} />
        </div>
      </div>
      <div className={`info-main grid-col-${enableCarry ? 3 : 4} grid-md-12`}>
        <div className="info-main__header">
          <div className="info-main__title">Portfolio, USD</div>
          <div className="info-main__icon">
            <i className="icon icon-eye" />
          </div>
        </div>
        <div className="info-main__value">
          <TokenPrice
            tokenAddress={tokenAddress}
            dollarSeparator=" "
            separator=" "
            isLegacy={isLegacy}
          />
        </div>
      </div>
      {enableCarry ? (
        <div className="info-main grid-col-3 grid-md-12">
          <div className="info-main__header">
            <div className="info-main__title">Accumulated carry</div>
            <div className="info-main__icon">
              <i className="icon icon-eye" />
            </div>
          </div>
          <div className="info-main__value">
            <TokenCarry
              tokenAddress={tokenAddress}
              dollarSeparator=" "
              separator=" "
              isLegacy={isLegacy}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className={`info-main grid-col-${enableCarry ? 2 : 4} grid-md-12`}>
        <div className="info-main__header">
          <div className="info-main__title">APY, %</div>
          <div className="info-main__icon">
            <i className="icon icon-arrows" />
          </div>
        </div>
        <div className="info-main__value">
          <APY tokenAddress={tokenAddress} decimals={2} isLegacy={isLegacy} />
        </div>
      </div>
      <div className="info-general grid-col-4 grid-lg-6 grid-md-12">
        <div className="info-general__header">
          <div className="info-general__title">Portfolio</div>
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
          <PortfolioPartsGraph tokenAddress={tokenAddress} web3={web3Global} />
        </div>
      </div>
      <div className="info-general _wide grid-col-8 grid-lg-6 grid-md-12">
        <div className="info-general__header">
          <div className="info-general__title">Token Price, USD</div>
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
          <TokenPriceGraph
            tokenAddress={tokenAddress}
            isAdmin={isAdmin}
            isLegacy={isLegacy}
          />
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
  );
}

export default TokenDashboard;
