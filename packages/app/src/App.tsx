import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "styled-components";

import i18next from "./i18n";
import theme from "./theme/theme";
import withConnectedWallet from "./hocs/withConnectedWallet";
import ModalProvider from "./context/ModalProvider";
import { AccountProvider } from "./context/AccountProvider";
import { ActiveWalletProvider } from "./context/ActiveWalletProvider";
import { FantomApiProvider } from "./context/FantomApiProvider";
import { SettingsProvider } from "./context/SettingsProvider";
import { TransactionProvider } from "./context/TransactionProvider";
import useDetectResolutionType from "./hooks/useDetectResolutionType";
import Home from "./containers/Home";
import SideBar from "./containers/SideBar/SideBar";
import Test from "./containers/Test/Test";
import TopBar from "./containers/TopBar/TopBar";
import Send from "./containers/Send";
import { Body, Heading1, Heading2 } from "./components";
import Column from "./components/Column";
import Spacer from "./components/Spacer";
import fWalletLogoImg from "./assets/img/fWalletLogo.svg";

const HomeWithWallet = withConnectedWallet(Home);
const SendWithWallet = withConnectedWallet(Send);

function App() {
  const resolutionType = useDetectResolutionType();
  return (
    <Providers>
      <Body>
        {resolutionType === "mobile" || resolutionType === "tablet" ? (
          <Column
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              alt="fwallet"
              style={{ width: "15rem" }}
              src={fWalletLogoImg}
            />
            <Spacer />
            <Heading1>Resolution not supported</Heading1>
            <Heading2>Mobile is coming soon!</Heading2>
          </Column>
        ) : (
          <>
            <SideBar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Suspense fallback="Loading">
                <TopBar />
              </Suspense>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  padding: "0 4rem 0 2rem",
                  backgroundColor: "rgba(10, 22, 46, 1)",
                }}
              >
                <Switch>
                  <Route path="/otherRoute" component={Test} />
                  <Route path="/home" component={HomeWithWallet} />
                  <Route path="/send" component={SendWithWallet} />
                  <Route path="/test" component={Test} />
                  <Route path="/staking" component={Test} />
                  <Route path="/defi" component={Test} />
                  <Route path="/governance" component={Test} />
                  <Route path="/" exact component={Test} />
                </Switch>
              </div>
            </div>
          </>
        )}
      </Body>
    </Providers>
  );
}

const Providers: React.FC<any> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18next}>
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          <FantomApiProvider>
            <AccountProvider>
              <ActiveWalletProvider>
                <TransactionProvider>
                  <ModalProvider>{children}</ModalProvider>
                </TransactionProvider>
              </ActiveWalletProvider>
            </AccountProvider>
          </FantomApiProvider>
        </SettingsProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
