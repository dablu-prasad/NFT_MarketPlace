const { expect } = require("chai");
const { ethers } = require("hardhat");
/* test/sample-test.js */
describe("NFTMarket", async () => {
  let Market;
  let market;
  let marketAddress
  let nftContractAddress
  let NFT
  let nft
  before(async () => {
    /* deploy the marketplace */
    Market = await ethers.getContractFactory("NFTMarket")
    market = await Market.deploy()
    await market.deployed()
    marketAddress = market.address

    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(marketAddress);
    await nft.deployed()
    nftContractAddress = nft.address

  })
 
  it("Should create Event and execute on market sales", async () => {

    console.log("NFTMarket Contract Address:", marketAddress)
    console.log("NFT Contract Address:", nftContractAddress)

    eventname1 = "sport"
    description1 = "This game fit your body"
    ticketamt1 = 1

    let listingPrice = await market.getListingPrice();
    listingprice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    //create Token
    let i = await nft.createToken("https://bafybeibrk5fx4qk7dgwp65jjuxdifnbh7lqbgegfydh7wuxwpty3inkbbm.ipfs.nftstorage.link/wonderful-tip-to-capture-your-pic-capturing-face-will-helpful-you-can-make-better-editing-backside-196157966.jpg");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, eventname1, description1, ticketamt1, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    // /* execute sale of token to another user */
    const buyerDetails = await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })
    //console.log(buyerDetails) 
    const buyerpurcheseNFT = await market.connect(buyerAddress).fetchMyNFTs();
    //console.log(buyerpurcheseNFT)
    expect(buyerpurcheseNFT[0].sold).to.equal(true);
  })

})











































it("Should other account create Event", async () => {

  //   console.log("NFTMarket Contract Address:", marketAddress)
  //   console.log("NFT Contract Address:", nftContractAddress)
  //   const [_, buyerAddress,buyerAddress2,buyerAddress3] = await ethers.getSigners()
  //   eventname1 = "cricket"
  //   description1 = "This game also fit your body"
  //   ticketamt1 = 1

  //   eventname2 = "chass"
  //   description2 = "This game also fit your mind"
  //   ticketamt2 = 1

  //   let listingPrice = await market.getListingPrice();
  //   listingprice = listingPrice.toString()

  //   const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  //   //create Token
  //   await nft.connect(buyerAddress).createToken("https://bafybeibrk5fx4qk7dgwp65jjuxdifnbh7lqbgegfydh7wuxwpty3inkbbm.ipfs.nftstorage.link/wonderful-tip-to-capture-your-pic-capturing-face-will-helpful-you-can-make-better-editing-backside-196157966.jpg");
    
  //   /* put both tokens for sale */
  //   await market.connect(buyerAddress).createMarketItem(nftContractAddress, 1, auctionPrice, eventname1, description1, ticketamt1, { value: listingPrice })
  

  //   // /* execute sale of token to another user */
  //   const buyerDetails1 = await market.connect(buyerAddress2).createMarketSale(nftContractAddress, 1, { value: auctionPrice })


  //   await nft.connect(buyerAddress).createToken("https://bafybeibrk5fx4qk7dgwp65jjuxdifnbh7lqbgegfydh7wuxwpty3inkbbm.ipfs.nftstorage.link/wonderful-tip-to-capture-your-pic-capturing-face-will-helpful-you-can-make-better-editing-backside-196157966.jpg");
  //   await market.connect(buyerAddress).createMarketItem(nftContractAddress, 2, auctionPrice, eventname2, description2, ticketamt2,{ value: listingPrice })
  //   const buyerDetails2 = await market.connect(buyerAddress3).createMarketSale(nftContractAddress, 2, { value: auctionPrice })
  //   //console.log(buyerDetails) 
  //   const buyerpurcheseNFT = await market.connect(buyerAddress1).fetchMyNFTs();
  //   //console.log(buyerpurcheseNFT)
  //   expect(buyerpurcheseNFT[0].sold).to.equal(true);
  // })