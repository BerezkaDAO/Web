import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "./widgets/useLocalStorage";

const ReferralHandler = () => {
  const location = useLocation();
  const [referer, setReferer] = useLocalStorage("REFERER");

  useEffect(() => {
    const fn = async () => {
      const params = new URLSearchParams(window.location.search);
      const newReferer = params.get("r");
      if (newReferer && !referer) {
        setReferer(newReferer);
      }
    };
    fn();
  }, [location, referer]);

  return <></>;
};

export default ReferralHandler;
