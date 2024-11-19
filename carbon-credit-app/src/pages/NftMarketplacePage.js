import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CarbonNftMarketplace from '../blockchain/CarbonNftMarketplace.json';
import '../styles/NftMarketplacePage.css';

const NftMarketplacePage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [nftDetails, setNftDetails] = useState([]);
  const [creditId, setCreditId] = useState('');
  const [price, setPrice] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [buyerAddresses, setBuyerAddresses] = useState({}); // Track buyer addresses for each NFT

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3Instance.eth.net.getId();
          const marketplaceData = CarbonNftMarketplace.networks[networkId];

          if (marketplaceData) {
            const marketplace = new web3Instance.eth.Contract(
              CarbonNftMarketplace.abi,
              marketplaceData.address
            );
            setMarketplaceContract(marketplace);
            const totalSupply = await marketplace.methods.nextTokenId().call();
            loadNftDetails(marketplace, totalSupply);
          } else {
            alert('Smart contract not deployed to detected network.');
          }
        } catch (error) {
          console.error('User denied account access', error);
        }
      } else {
        alert('Please install MetaMask.');
      }
    };

    const loadNftDetails = async (marketplace, totalSupply) => {
      const details = [];
      for (let i = 0; i < totalSupply; i++) {
        const nft = await marketplace.methods.nfts(i).call();
        if (nft.isAvailable) {
          details.push(nft);
        }
      }
      setNftDetails(details);
    };

    loadBlockchainData();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  const listNft = async () => {
    try {
      await marketplaceContract.methods
        .listNFT(creditId, web3.utils.toWei(price, 'ether'), tokenURI)
        .send({ from: account });
      alert('NFT listed successfully!');
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  const buyNft = async (tokenId, price) => {
    try {
      const buyerAddress = buyerAddresses[tokenId];
      if (!buyerAddress) {
        alert('Please enter a buyer address.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Ensure MetaMask is authorized

      await marketplaceContract.methods
        .buyNFT(tokenId)
        .send({ from: buyerAddress, value: web3.utils.toWei(price, 'ether') });
      alert('NFT purchased successfully!');
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  const handleBuyerAddressChange = (tokenId, value) => {
    setBuyerAddresses((prevAddresses) => ({
      ...prevAddresses,
      [tokenId]: value,
    }));
  };

  return (
    <div>
      <h2>NFT Marketplace</h2>
      <div className="form-section">
        <h3>List NFT</h3>
        <input type="number" placeholder="Credit ID" value={creditId} onChange={(e) => setCreditId(e.target.value)} />
        <input type="text" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="Token URI" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
        <button onClick={listNft}>List NFT</button>
      </div>

      <div>
        <h3>Available NFTs</h3>
        {nftDetails.length > 0 ? (
          nftDetails.map((nft, index) => (
            <div className="nft-card" key={index}>
              <p><strong>Token ID:</strong> {nft.tokenId}</p>
              <p><strong>Price:</strong> {web3.utils.fromWei(nft.price, 'ether')} ETH</p>
              <p><strong>Seller:</strong> {nft.seller}</p>
              <input
                type="text"
                placeholder="Buyer Address"
                value={buyerAddresses[nft.tokenId] || ''}
                onChange={(e) => handleBuyerAddressChange(nft.tokenId, e.target.value)}
              />
              <button onClick={() => buyNft(nft.tokenId, web3.utils.fromWei(nft.price, 'ether'))}>Buy NFT</button>
            </div>
          ))
        ) : (
          <p>No NFTs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default NftMarketplacePage;
