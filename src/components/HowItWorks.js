import React from "react";

class HowItWorks extends React.Component {
  render() {
    return (
      <section
        className="section _bg _full section_how"
        data-class="HowItWorks"
      >
        <h2 className="title">How it works</h2>
        <div className="separator" />
        <div className="steps _centered">
          <div className="step">
            <div className="step__number">01</div>
            <div className="step__row">
              <div className="step__title">Chоose your strategy</div>
              <div className="step__description">
                <p>
                  Build your portfolio with different allocation strategies that
                  aim to maximize your returns and keep you in your comfortable
                  risk zone
                </p>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step__number">02</div>
            <div className="step__row">
              <div className="step__title">Deposit your stablecoin</div>
              <div className="step__description">
                <p>
                  Just deposit and relax. Your funds will be automatically
                  allocated across DeFi protocols and you will immediately start
                  earning interest.
                </p>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step__number">03</div>
            <div className="step__row">
              <div className="step__title">
                Watch Semi-Automated Rebalancing
              </div>
              <div className="step__description">
                <p>
                  Market opportunities and sentiments continuously monitored via
                  oracles, bots and other tools. Portfolio reallocation-
                  semi-automatic to avoid potential market data violations and
                  hacks
                </p>
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step__number">04</div>
            <div className="step__row">
              <div className="step__title">Redeem Instantly</div>
              <div className="step__description">
                <p>
                  Monitor your funds' performance and rebalance events, see your
                  estimated earnings and easlily redeem your funds + interest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HowItWorks;
