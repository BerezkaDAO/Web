import React from "react";

class BlockedPolicy extends React.Component {
  render() {
    return (
      <div className="policy">
        <section className="section" style={{ paddingLeft: "190px" }}>
          <div className="section__header">
            <h1
              className="title __warning"
              style={{
                marginLeft: "-190px",
              }}
            >
              We apologize
            </h1>
            <div
              className="subtitle __warning"
              style={{
                color: "white",
                fontWeight: "normal",
                marginLeft: "-185px",
              }}
            >
              but the service is not available for your country
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default BlockedPolicy;
