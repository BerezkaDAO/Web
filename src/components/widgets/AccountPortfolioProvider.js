import React, { useEffect, useState } from "react";
import { fetchClientToken } from "./clients";

const AccountPortfolioProvider = (props) => {
  const { token, wallet, childrenLoading, children } = props;
  const [data, setData] = useState();
  useEffect(() => {
    const fn = async () => {
      const result = await fetchClientToken(wallet, token);
      setData(result);
    };
    fn();
  }, [wallet, token]);

  if (!data) {
    return <>{childrenLoading()}</>;
  }

  return <>{children(data)}</>;
};

export default AccountPortfolioProvider;
