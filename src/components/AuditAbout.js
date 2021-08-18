import React from "react";

class AuditAbout extends React.Component {
  render() {
    return (
      <div className="section _with-aside _mb">
        <div></div>
        <div className="information">
          <div className="information__item">
            <div className="information__title">
              Berezka DAO is a decentralized autonomous organization based on
              Aragon.
            </div>
            <div className="information__title">
              Aragon Smart Contract Audits
            </div>
            <div className="information__text">
              A number of audits have been performed on the existing smart
              contract codebase by the White Hat Group, Consensys Diligence,
              Authio, and others. Ongoing smart contract changes will continue
              being audited at the Aragon Association's discretion.
            </div>
            <div className="information__text">
              Details:&nbsp;
              <a className="link-color" href="">
                https://wiki.aragon.org/association/security/audits/audit_whg01_report/
              </a>
            </div>
          </div>
          <div className="information__item">
            <div className="information__title">White Hat Group</div>
            <div className="information__title">Consensys Diligence</div>
            <div className="information__text">
              As one of the most experienced teams in the space, ConsenSys
              Diligence is at the cutting edge of offensive cryptography,
              blockchain technology, and cryptoeconomic incentive analysis.
            </div>
            <div className="information__title">Authio</div>
            <div className="information__text">
              Authio is a smart contract auditing and security consulting firm.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuditAbout;
