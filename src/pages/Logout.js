import React, { useEffect } from "react";

import { useStateValue } from "state/State";
import ApiRequest from "utils/ApiRequest";
import { deleteLoginData } from "utils/Auth";
import Loading from "utils/Loading";

const Logout = ({ history }) => {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      ApiRequest.delete("session").finally(() => {
        deleteLoginData(dispatch);
        history.push("/");
      });
    }
  });

  return <Loading />;
};

export default Logout;
