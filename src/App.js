import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Footer, HeroSection, WalletInfo } from "../src/style";
import logo from "../src/assets/LOOG.png";
import left from "../src/assets/596.png";
import right from "../src/assets/2171.png";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 20px 60px;
  border-radius: 50px;
  border: none;
  background-color: #fff;
  font-weight: bold;
  color: #000;
  margin-right: 15px;
  margin-bottom: 15px;
  font-family: ComicSansMS3 !important;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  // padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #fec6bd;
  // padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 45px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [claimingWlNft, setClaimingWlNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click mint now to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintNormAmount, setMintNormAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    WHITELIST_WEI_COST: 0,
    WHITELIST_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = data.getunitPrice;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintNormAmount);
    let totalGasLimit = String(gasLimit * mintNormAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintNormAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit https://opensea.io/ to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  //Claim Whitelist NFT
  const claimWhitelistNFTs = () => {
    let cost = CONFIG.WHITELIST_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingWlNft(true);
    blockchain.smartContract.methods
      .presaleMint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong ");
        setClaimingWlNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit https://opensea.io/ to view it.`
        );
        setClaimingWlNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintNormAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintNormAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintNormAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintNormAmount(newMintAmount);
  };


  //Whitelist Mint
  const decrementWlMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementWlMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 3) {
      newMintAmount = 3;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  //console.log(data.whiteList)

  return (
    <>
      <HeroSection>
        <div className="header">
          <div className="logo">
            <a href="https://www.meta-otters.com/">
              <img src={logo} alt="" />
              <h1>METAOTTERS</h1>
            </a>
            <p>{blockchain.account}</p>
          </div>

          <div className="nav">
            <li>Home</li>
            <li>Roadmap</li>
            <li>FAQ</li>
            <li>Team</li>
          </div>
        </div>

        <div className="container">
          {/* <div className="left">
            <div className="picture">
              <img src={left} alt="" />
            </div>
          </div> */}

          <div className="middle">
            <h1>METAOTTERS</h1>
            <p>
              MetaOtters is a group of amazing digital creatures, a collection
              of 8888 unique NFTs, delpoyed on the Ethereum Mainnet blockchain,
              ERC-721 standard.
            </p>
            <s.Container>
              <ResponsiveWrapper>
                <s.Container
                  flex={2}
                  jc={"center"}
                  ai={"center"}
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <s.TextTitle
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        The sale has ended.
                      </s.TextTitle>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        You can still find {CONFIG.NFT_NAME} on
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledLink
                        target={"_blank"}
                        href={CONFIG.MARKETPLACE_LINK}
                      >
                        {CONFIG.MARKETPLACE}
                      </StyledLink>
                    </>
                  ) : (
                    <>
                      <s.SpacerXSmall />
                      <s.SpacerSmall />
                      {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            Connect Wallet
                          </StyledButton>
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                }}
                              >
                                {blockchain.errorMsg}
                              </s.TextDescription>
                            </>
                          ) : null}
                        </s.Container>
                      ) : data.whiteList === true ? (
                        <>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {feedback}
                          </s.TextDescription>
                          <h1>
                            {data.totalSupply} OF {CONFIG.MAX_SUPPLY}
                          </h1>
                          <p style={{ color: "var(--accent-text)" }}>
                            1 {CONFIG.SYMBOL} costs {CONFIG.WHITELIST_COST}
                            {CONFIG.NETWORK.SYMBOL}.
                          </p>
                          {/* <p >{blockchain.account}</p> */}
                          <s.Container
                            ai={"center"}
                            jc={"center"}
                            fd={"row"}
                            style={{ display: "flex" }}
                          >
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementWlMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementWlMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                              disabled={claimingWlNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimWhitelistNFTs();
                                getData();
                              }}
                            >
                              {claimingWlNft ? "Minting" : "WL Mint Now"}
                            </StyledButton>
                          <s.SpacerSmall />

                            <p style={{ color: "var(--accent-text)" }}>
                            1 {CONFIG.SYMBOL} costs {data.getunitPrice / 1000000000000000000}
                            {CONFIG.NETWORK.SYMBOL}.
                          </p>
                          <s.Container
                            ai={"center"}
                            jc={"center"}
                            fd={"row"}
                            style={{ display: "flex" }}
                          >
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintNormAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount(); 
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>


                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "Minting" : "Mint Now"}
                            </StyledButton>
                          </s.Container>
                        </>
                      ) : data.whiteList === false ? (
                        <>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {feedback}
                          </s.TextDescription>
                          <h1>
                            {data.totalSupply} OF {CONFIG.MAX_SUPPLY}
                          </h1>
                          <p style={{ color: "var(--accent-text)" }}>
                            1 {CONFIG.SYMBOL} costs{" "}
                            {data.getunitPrice / 1000000000000000000}
                            {CONFIG.NETWORK.SYMBOL}.
                          </p>
                          {/* <p>{blockchain.account}</p> */}
                          <s.Container
                            ai={"center"}
                            jc={"center"}
                            fd={"row"}
                            style={{ display: "flex" }}
                          >
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.SpacerMedium />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintNormAmount}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.SpacerSmall />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "Minting" : "Mint Now"}
                            </StyledButton>
                          </s.Container>
                        </>
                      ) : null}
                    </>
                  )}
                  <s.SpacerMedium />
                </s.Container>
              </ResponsiveWrapper>
              <s.SpacerMedium />
            </s.Container>
          </div>

          {/* <div className="right">
            <div className="picture">
              <img src={right} alt="" />
            </div>
          </div> */}
          {/* <div className="text">
            <h1>MetaBulls Club</h1>
          </div>
          <div className="image"></div>

          <div className="text">
            <p>
              Connect to your Metamask wallet and select the number of Metabulls
              you would like to mint. Each wallet is limited to mint 7
              MetaBulls. Once you’ve selected the number of NFTs you’d like to
              mint, just click on “Mint Now” and confirm the transaction through
              your wallet. Your Metabulls NFTs will then be processed through
              the ethereum network.
            </p>
          </div> */}
        </div>
      </HeroSection>
    </>
  );
}

export default App;
