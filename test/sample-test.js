const { expect } = require("chai");
/* test/sample-test.js */
describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    console.log(market)
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed()
    console.log(nft)
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

   const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    //create Token
    let i=await nft.createToken("https://gateway.pinata.cloud/ipfs/QmNtwRVQZtybnywZWF9uAedQrus4rCgEBDz9A8zP5FrbEc?preview=1");
console.log(i)
/* put both tokens for sale */
await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
//await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

// const [_, buyerAddress] = await ethers.getSigners()

// /* execute sale of token to another user */
// await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})
  })
})