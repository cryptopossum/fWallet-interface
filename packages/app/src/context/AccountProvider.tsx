import React, { useReducer } from "react";

export type ProviderType = "metamask" | "keyStore";
export interface Wallet {
  address: string;
  providerType: ProviderType;
  walletProvider?: any;
}
const initial: { wallets: Wallet[] } = {
  wallets: [],
};
export const AccountContext = React.createContext(null);

export const AccountProvider: React.FC = ({ children }) => {
  const accountReducer = (state: any, action: any) => {
    switch (action.type) {
      case "addWallet":
        // Dont add account if the account already exist
        if (
          state.wallets.find(
            (wallet: Wallet) =>
              wallet.address.toLowerCase() ===
              action.wallet.address.toLowerCase()
          )
        ) {
          return state;
        }
        return {
          wallets: [...state.wallets, action.wallet],
        };
      case "removeWallet":
        return {
          wallets: state.wallets.filter(
            (wallet: Wallet) => wallet.address !== action.address
          ),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(accountReducer, initial);

  return (
    <AccountContext.Provider value={[state, dispatch]}>
      {children}
    </AccountContext.Provider>
  );
};
