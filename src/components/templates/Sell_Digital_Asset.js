import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from './artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { useState } from "react";
import { ethers } from "ethers";
import {nftaddress,nftmarketaddress} from './config.js'
import Home from "./Home"
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// import { NFTStorage, File } from 'nft.storage'
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENkZTI1YzM5YjFDNjA0NmVmM2Q5M0E5MjIwNTc3QjI2NDIzRkIzNTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDY1MjMyNDUzNywibmFtZSI6Ik5GVCAyLjAifQ.H-k_ZgK5lKdqsCR4s7kAk7W9A-eRNmFliZLLL4ISexY'

export default function CreateItem() {
    const [formInput, updateFormInput] = useState({ amount: '',price: '', name: '', description: '' })
   

      async function createMarket() {
        const file = document.querySelector('input[type="file"]');
        const { name, description, price,amount } = formInput
        if (!name || !description || !price || !file || !amount)  return
        /* first, upload to IPFS */
        const storage = new NFTStorage({ token: API_TOKEN });
        try {
          const metadata = await storage.store({
            name: name,
            description: description,
            price:price,
            amount:amount,
            image: file.files[0],
          });
    
          console.log(metadata);
          const imgUrl = metadata.embed().image.href;
         const name1= metadata.data.name;
         const description1= metadata.data.description;
          const amount1=metadata.data.amount;
          /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
          // const cid = await storage.add(metadata)
          // console.log(cid)
          createSale(imgUrl,name1,description1,amount1)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
        clearText() ;
      }

      function clearText()  
    {
        document.getElementById('i1').value = "";
        document.getElementById('i2').value = "";
        document.getElementById('i3').value = "";
        document.getElementById('i4').value = "";
        
    } 

      async function createSale(url,name1,description1,amount1) {
         await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);   
        const signer = provider.getSigner()
        console.log(url)
        console.log(name1)
        console.log(description1)
        console.log(amount1)
        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        console.log(transaction)
        console.log(transaction.value.toNumber())
       // let tokenId = transaction.value.toNumber()
        let tx = await transaction.wait()
        console.log(tx)


        
        let event = tx.events[0]
        console.log(event)
        let value = event.args[2]
        let tokenId = value.toNumber()
    
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
   
      
        /* then list the item for sale on the marketplace */
        contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
    
        transaction = await contract.createMarketItem(nftaddress, tokenId, price,name1,description1,amount1, { value: listingPrice });
      }
  return (
    <div>
    <Home/>
<div className="mb-3">
<label  className="form-label">Event Name:</label>
<input className="form-control" id="i1" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
</div>
<div className="mb-3">
<label  className="form-label">Description:</label>
<textarea  className="form-control" id="i2" onChange={e=>updateFormInput({ ...formInput,description:e.target.value})}/>
</div>
<div className="mb-3">
<label  className="form-label">Price:</label>
<input  className="form-control" id="i3" onChange={e=>updateFormInput({...formInput,price:e.target.value})}/>
</div>
<div className="mb-3">
<label  className="form-label">Ticket Amt:</label>
<textarea  className="form-control" id="i4" onChange={e=>updateFormInput({ ...formInput,amount:e.target.value})}/>
</div>
<div>
{/* <input type="file" className="my-4" id="i5" onChange={onChange}/>
{ fileUrl && (<img className="rounded mt-4" id="i6" width="350" src={fileUrl} />)} */}
<div className="form__input">
										<label htmlFor="">Upload File</label>
										<input
											type="file"
											className="upload__input"
										/>
									</div>
</div>
<button onClick={createMarket} className="btn btn-primary" >Mint Item</button>
    </div>
  )
}


































































// import NFT from './artifacts/contracts/NFT.sol/NFT.json'
// import NFTMarket from './artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import { useState } from "react";
// import { ethers } from "ethers";
// import {nftaddress,nftmarketaddress} from './config.js'
// import Home from "./Home"
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


// export default function CreateItem() {
//     const[fileUrl,setFileUrl]=useState(null);
//     const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
   
//     async function onChange(e) {
//         const file = e.target.files[0]
//         try {
//           const added = await client.add(
//             file,
//             {
//               progress: (prog) => console.log(`received: ${prog}`)
//             }
//           )
//           const url = `https://ipfs.infura.io/ipfs/${added.path}`
//           setFileUrl(url)
//         } catch (error) {
//           console.log('Error uploading file: ', error)
//         }  
//       }
//       async function createMarket() {
//         const { name, description, price } = formInput
//         if (!name || !description || !price || !fileUrl) return
//         /* first, upload to IPFS */
//         const data = JSON.stringify({
//           name, description, image: fileUrl
//         })
//         try {
//           const added = await client.add(data)
//           const url = `https://ipfs.infura.io/ipfs/${added.path}`
//           /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
//           createSale(url)
//         } catch (error) {
//           console.log('Error uploading file: ', error)
//         }  
//         clearText() ;
//       }

//       function clearText()  
//     {
//         document.getElementById('i1').value = "";
//         document.getElementById('i2').value = "";
//         document.getElementById('i3').value = "";
//         document.getElementById('i4').value = "";
//         document.getElementById('i5').value = "";
//     } 

//       async function createSale(url) {
//          await window.ethereum.request({ method: 'eth_requestAccounts' })
//         const provider = new ethers.providers.Web3Provider(window.ethereum);   
//         const signer = provider.getSigner()
//         console.log(url)
        
//         /* next, create the item */
//         let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
//         let transaction = await contract.createToken(url)
//         console.log(transaction)
//         console.log(transaction.value.toNumber())
//        // let tokenId = transaction.value.toNumber()
//         let tx = await transaction.wait()
//         console.log(tx)


        
//         let event = tx.events[0]
//         console.log(event)
//         let value = event.args[2]
//         let tokenId = value.toNumber()
    
//         const price = ethers.utils.parseUnits(formInput.price, 'ether')
      
//         /* then list the item for sale on the marketplace */
//         contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
//        console.log(contract)
       
//         let listingPrice = await contract.getListingPrice()
//         listingPrice = listingPrice.toString()
    
//         transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
//         //await transaction.wait()
//       //  router.push('/')
//       }
//   return (
//     <div>
//     <Home/>
// <div className="mb-3">
// <label  className="form-label">Name:</label>
// <input className="form-control" id="i1" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
// </div>
// <div className="mb-3">
// <label  className="form-label">Description:</label>
// <textarea  className="form-control" id="i2" onChange={e=>updateFormInput({ ...formInput,description:e.target.value})}/>
// </div>
// <div className="mb-3">
// <label  className="form-label">Price:</label>
// <input  className="form-control" id="i3" onChange={e=>updateFormInput({...formInput,price:e.target.value})}/>
// </div>
// <div>
// <input type="file" className="my-4" id="i4" onChange={onChange}/>
// { fileUrl && (<img className="rounded mt-4" id="i5" width="350" src={fileUrl} />)}
// </div>
// <button onClick={createMarket} className="btn btn-primary" >Sell_Digital_Asset</button>
//     </div>
//   )
// }