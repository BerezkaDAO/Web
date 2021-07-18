import React, { useState, useEffect, useCallback } from "react";
import Main from "./Main";
import Web3 from "web3";
import Web3Modal from "web3modal";
import CountryBlock from "./CountryBlock";

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,
});

const Application = () => {
  const [web3Local, setWeb3Local] = useState(null);
  const [web3Global, setweb3Global] = useState(null);
  const [address, setAddress] = useState(null);
  const [countryCode, setCountryCode] = useState(null);

  const connectWeb3 = useCallback(async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const address = await web3.currentProvider.enable();
    setWeb3Local(web3);
    setAddress(address[0]);
    return [web3, address[0]];
  });
  useEffect(() => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://eth-mainnet.alchemyapi.io/v2/-r5u2mpuXHKVbfRG5fRAEMmMS9Ix4eHF"
      )
    );
    setweb3Global(web3);
  }, []);

  useEffect(() => {
    const fn = async () => {
      if (!countryCode) {
        const geo = await fetch(
          "https://api.ipgeolocation.io/ipgeo?apiKey=aafb8b776cde407aacde27b6ee55b018"
        ).then((res) => res.json());
        setCountryCode(geo.country_code2);
      }
    };
    fn();
  }, [countryCode]);

  return (
    <>
      <CountryBlock countryCode={countryCode}>
        <Main
          address={address}
          web3Local={web3Local}
          web3Global={web3Global}
          connectWeb3={connectWeb3}
          countryCode={countryCode}
        />
      </CountryBlock>
    </>
  );
};

export default Application;
