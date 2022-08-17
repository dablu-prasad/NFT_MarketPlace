/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from './config'

import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import Market from './artifacts/contracts/NFTMarket.sol/NFTMarket.json'

function Index_Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/ec728920c04c4ad0a9aa987595f7425a")
    //const provider = new ethers.providers.JsonRpcProvider()
    //await window.ethereum.request({ method: 'eth_requestAccounts' })
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      console.log(i)
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log(tokenUri)
      const meta = await axios.get(tokenUri)
      console.log(meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.request.responseURL,
        name: i.name,
        description: i.description,
        amount: i.ticketamt,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')  
    console.log("1") 
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    console.log("2") 
  //  await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="card">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
      <div  className="card" style={{width: 18+'rem'}}>
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <p className="text-2xl mb-4 font-bold text-white">{nft.amount.toString()} Ticket</p>
                  <button className="btn btn-primary" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Index_Home;
































// /* pages/index.js */
// import { ethers } from 'ethers'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import Web3Modal from "web3modal"

// import {
//   nftaddress, nftmarketaddress
// } from './config'

// import NFT from './artifacts/contracts/NFT.sol/NFT.json'
// import Market from './artifacts/contracts/NFTMarket.sol/NFTMarket.json'

// function Index_Home() {
//   const [nfts, setNfts] = useState([])
//   const [loadingState, setLoadingState] = useState('not-loaded')
//   useEffect(() => {
//     loadNFTs()
//   }, [])
//   async function loadNFTs() {
//     /* create a generic provider and query for unsold market items */
//     const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/ec728920c04c4ad0a9aa987595f7425a")
//     //await window.ethereum.request({ method: 'eth_requestAccounts' })
//     //const provider = new ethers.providers.Web3Provider(window.ethereum);
//     //const signer = provider.getSigner();
//     const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
//     const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
//     const data = await marketContract.fetchMarketItems()

//     /*
//     *  map over items returned from smart contract and format 
//     *  them as well as fetch their token metadata
//     */
//     const items = await Promise.all(data.map(async i => {
//       const tokenUri = await tokenContract.tokenURI(i.tokenId)
//       const meta = await axios.get(tokenUri)
//       let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
//       let item = {
//         price,
//         tokenId: i.tokenId.toNumber(),
//         seller: i.seller,
//         owner: i.owner,
//         image: meta.data.image,
//         name: meta.data.name,
//         description: meta.data.description,
//       }
//       return item
//     }))
//     setNfts(items)
//     setLoadingState('loaded') 
//   }
//   async function buyNft(nft) {
//     /* needs the user to sign the transaction, so will use Web3Provider and sign it */
//     const web3Modal = new Web3Modal()
//     const connection = await web3Modal.connect()
//     const provider = new ethers.providers.Web3Provider(connection)
//     const signer = provider.getSigner()
    
//     const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

//     /* user will be prompted to pay the asking proces to complete the transaction */
//     const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
//     const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
//       value: price
//     })
//   //  await transaction.wait()
//     loadNFTs()
//   }
//   if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
//   return (
//     <div className="flex justify-center">
//       <div className="px-4" style={{ maxWidth: '1600px' }}>
//       <div  className="card" style={{width: 18+'rem'}}>
//           {
//             nfts.map((nft, i) => (
//               <div key={i} className="border shadow rounded-xl overflow-hidden">
//                 <img src={nft.image} />
//                 <div className="p-4">
//                   <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
//                   <div style={{ height: '70px', overflow: 'hidden' }}>
//                     <p className="text-gray-400">{nft.description}</p>
//                   </div>
//                 </div>
//                 <div className="p-4 bg-black">
//                   <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
//                   <button className="btn btn-primary" onClick={() => buyNft(nft)}>Buy</button>
//                 </div>
//               </div>
//             ))
//           }
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Index_Home;