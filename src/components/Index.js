import React from "react";
import Brands from "./Brands";
import Audit from "./Audit";
import AssetTable from "./AssetTable";
import AuditAbout from "./AuditAbout";
import HowItWorks from "./HowItWorks";
import Title from "./Title";

function Index(props) {
  const { connectWeb3, web3Global } = props;

  return (
    <div className="index">
      <Title />
      <AssetTable connectWeb3={connectWeb3} web3Global={web3Global} />
      <Brands />
      <Audit />
      <AuditAbout />
      <HowItWorks />
    </div>
  );
}

export default Index;
