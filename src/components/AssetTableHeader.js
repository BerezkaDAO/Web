import React from "react";

class AssetTableHeader extends React.Component {
  render() {
    return (
      <div className="main-table__tr" data-class="AssetTableHeader">
        <div className="main-table__th">Products</div>
        <div className="main-table__th" style={{ textAlign: "left" }}>
          Total Value Locked (TLV)
        </div>
        <div className="main-table__th" style={{ textAlign: "left" }}>
          Annual Percentage Yield
        </div>
        <div className="main-table__th" />
      </div>
    );
  }
}
export default AssetTableHeader;
