import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchDaos, getAvailableDaos } from "./widgets/daoes";
import { defaultToken } from "./data/tokens";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3, web3Global } = props;

  const [open, setOpen] = useState();
  const [daos, setDaos] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (location.hash && location.hash.endsWith(`#${defaultToken[0]}`)) {
      setOpen(defaultToken[0]);
    }
  }, [location]);

  useEffect(() => {
    const fn = async () => {
      const daoTokens = await fetchDaos();
      setDaos(daoTokens);
    };
    fn();
  }, []);

  return (
    <div className="section _full main-table _mb">
      <AssetTableHeader />
      {daos.map((dao) => {
        const { id } = dao;
        return (
          <AssetTableRow
            open={open === id}
            onClick={() => {
              if (open === id) {
                setOpen(null);
              } else {
                setOpen(id);
              }
            }}
            key={id}
            dao={dao}
            connectWeb3={connectWeb3}
            web3Global={web3Global}
          />
        );
      })}
    </div>
  );
}

export default AssetTable;
