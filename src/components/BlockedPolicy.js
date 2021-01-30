import React from "react";

class BlockedPolicy extends React.Component {
  render() {
    return (
      <div className="policy">
        <section className="section" style={{ paddingLeft: "190px" }}>
          <div className="section__header">
            <h1
              className="title"
              style={{
                fontWeight: "normal",
                marginLeft: "-190px",
                fontSize: "100px",
              }}
            >
              We apologize
            </h1>
            <div
              className="section__subtitle"
              style={{
                color: "white",
                fontWeight: "normal",
                marginLeft: "-185px",
                fontSize: "38px",
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
