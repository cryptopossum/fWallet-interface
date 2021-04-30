import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import { Button } from "../../components";
import { send } from "../../utils/contract";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import useWalletProvider from "../../hooks/useWalletProvider";
import useTransaction from "../../hooks/useTransaction";
import { GET_GAS_PRICE, GET_TOKEN_PRICE } from "../../graphql/subgraph";
import { ThemeContext } from "styled-components";
import { useHistory } from "react-router-dom";
import { restoreAccountByPrivateKey } from "../../fantom/FantomWeb3Wallet";

const getNativeBalance = async (provider: Web3Provider, account: string) => {
  const balance = await provider.getBalance(account);
  return balance.toString();
};

const callContract = async (
  contracts: Map<string, Contract>,
  account: string
) => {
  const ppdexContract = contracts.get("PPDEX");
  const balance = await ppdexContract.balanceOf(account);
  return balance.toString();
};

const sendContract = async (
  contracts: Map<string, Contract>,
  dispatch: any,
  provider: Web3Provider
) => {
  const ppdexContract = contracts.get("PPDEX");
  return send(provider, () => ppdexContract.stakePpblz(100), dispatch);
};

const Test: React.FC<any> = () => {
  const { wallet } = useWalletProvider();
  const { transaction, dispatchTx } = useTransaction();
  const { color } = useContext(ThemeContext);
  const history = useHistory();
  const {
    loading: GET_GAS_PRICE_loading,
    error: GET_GAS_PRICE_error,
    data: GET_GAS_PRICE_data,
  } = useQuery(GET_GAS_PRICE);
  const {
    loading: GET_TOKEN_PRICE_loading,
    error: GET_TOKEN_PRICE_error,
    data: GET_TOKEN_PRICE_data,
  } = useQuery(GET_TOKEN_PRICE, { variables: { to: "USD" } });

  const [loading, setLoading] = useState([]);
  const [notConnectedNativeBalance, setNotConnectedNativeBalance] = useState(
    null
  );
  const [nativeBalance, setNativeBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    console.log({
      GET_GAS_PRICE_loading,
      GET_GAS_PRICE_error,
      GET_GAS_PRICE_data,
    });
  }, [GET_GAS_PRICE_loading, GET_GAS_PRICE_error, GET_GAS_PRICE_data]);

  useEffect(() => {
    console.log({
      GET_TOKEN_PRICE_loading,
      GET_TOKEN_PRICE_error,
      GET_TOKEN_PRICE_data,
    });
  }, [GET_TOKEN_PRICE_loading, GET_TOKEN_PRICE_error, GET_TOKEN_PRICE_data]);

  return (
    <div
      style={{
        backgroundColor: color.secondary.navy(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "4rem",
      }}
    >
      <div
        style={{
          height: "2rem",
          paddingBottom: "2rem",
          fontSize: "40px",
          fontWeight: "bold",
        }}
      >
        {history.location.pathname}
      </div>
      <Button
        variant="primary"
        disabled={!wallet.provider}
        onClick={() =>
          getNativeBalance(
            wallet.provider,
            "0x93FF1ff42f534BbEE207fa380d967C760d27076A"
          ).then((result) => setNotConnectedNativeBalance(result))
        }
      >
        Get Native Balance Without being connected
      </Button>
      <div>Your native balance: {notConnectedNativeBalance || "No data"}</div>
      <div style={{ height: "2rem" }} />
      <Button
        variant="primary"
        disabled={!wallet.provider}
        onClick={() =>
          getNativeBalance(wallet.provider, wallet.account).then((result) =>
            setNativeBalance(result)
          )
        }
      >
        Get Native Balance
      </Button>
      <div>Your native balance: {nativeBalance || "No data"}</div>
      <div style={{ height: "2rem" }} />
      <Button
        variant="primary"
        disabled={!wallet.provider}
        onClick={() =>
          callContract(wallet.contracts, wallet.account).then((result) =>
            setTokenBalance(result)
          )
        }
      >
        Get Token Balance
      </Button>
      <div>Your token balance: {tokenBalance || "No data"}</div>
      <div style={{ height: "2rem" }} />
      <Button
        variant="primary"
        disabled={!wallet.provider}
        onClick={() => {
          setLoading([...loading, "test"]);
          sendContract(
            wallet.contracts,
            dispatchTx,
            wallet.provider
          ).finally(() =>
            setLoading(loading.filter((item) => item === "test"))
          );
        }}
      >
        {loading.find((item) => item === "test")
          ? "Sending..."
          : "Send Transaction"}
      </Button>
      <div>
        <div style={{ fontWeight: "bold" }}> Transaction details: </div>
        {transaction && transaction.id ? (
          <p>{JSON.stringify(transaction)}</p>
        ) : (
          <span>
            {transaction.error
              ? JSON.stringify(transaction.error.error.message, null, 2)
              : "No transaction data"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Test;