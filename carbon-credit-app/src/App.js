import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Web3 from 'web3';
import CreditExchangePage from './pages/CreditExchangePage';
import NftMarketplacePage from './pages/NftMarketplacePage';
import './styles/App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const accountBalance = await web3Instance.eth.getBalance(accounts[0]);
        setBalance(web3Instance.utils.fromWei(accountBalance, 'ether'));
      } else {
        alert('Please install MetaMask.');
      }
    };

    loadWeb3();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Carbon Credit DApp</h1>
          <nav>
            <Link to="/">Credit Exchange</Link>
            <Link to="/marketplace">NFT Marketplace</Link>
          </nav>
          <div className="account-info">
            <p><strong>Connected Account:</strong> {account ? account : 'Not Connected'}</p>
            <p><strong>Balance:</strong> {balance ? `${balance} ETH` : 'N/A'}</p>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CreditExchangePage />} />
            <Route path="/marketplace" element={<NftMarketplacePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
