import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CarbonCreditExchange from '../blockchain/CarbonCreditExchange.json';
import '../styles/CreditExchangePage.css';

const CreditExchangePage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [exchangeContract, setExchangeContract] = useState(null);
  const [project, setProject] = useState('');
  const [amount, setAmount] = useState('');
  const [expiration, setExpiration] = useState('');
  const [creditId, setCreditId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showDetails, setShowDetails] = useState(false); // New state for showing details

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const exchangeData = CarbonCreditExchange.networks[networkId];

        if (exchangeData) {
          const exchange = new web3Instance.eth.Contract(
            CarbonCreditExchange.abi,
            exchangeData.address
          );
          setExchangeContract(exchange);
        } else {
          alert('Smart contract not deployed to detected network.');
        }
      } else {
        alert('Please install MetaMask.');
      }
    };

    loadBlockchainData();
  }, []);

  const issueCredit = async () => {
    try {
      await exchangeContract.methods
        .issueCredit(project, amount, expiration)
        .send({ from: account });
      alert('Credit issued successfully!');
    } catch (error) {
      console.error('Error issuing credit:', error);
    }
  };

  const transferCredit = async () => {
    try {
      await exchangeContract.methods
        .transferCredit(creditId, recipient)
        .send({ from: account });
      alert('Credit transferred successfully!');
    } catch (error) {
      console.error('Error transferring credit:', error);
    }
  };

  const getCreditDetails = () => {
    // Simulating fetching data and showing pre-defined details for demo
    setShowDetails(true);
  };

  return (
    <div className="credit-exchange-page">
      <h2>Credit Exchange</h2>
      <div className="form-section">
        <h3>Issue Credit</h3>
        <input type="text" placeholder="Project Name" value={project} onChange={(e) => setProject(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="number" placeholder="Expiration (days)" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
        <button className="action-button" onClick={issueCredit}>Issue Credit</button>
      </div>

      <div className="form-section">
        <h3>Transfer Credit</h3>
        <input type="number" placeholder="Credit ID" value={creditId} onChange={(e) => setCreditId(e.target.value)} />
        <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <button className="action-button" onClick={transferCredit}>Transfer Credit</button>
      </div>

      <div className="form-section">
        <h3>Get Credit Details</h3>
        <input type="number" placeholder="Credit ID" value={creditId} onChange={(e) => setCreditId(e.target.value)} />
        <button className="action-button" onClick={getCreditDetails}>Get Details</button>
        {showDetails && (
          <div className="details-section">
            <p><strong>ID:</strong> 21</p>
            <p><strong>Project:</strong> Reducing Fossil Fuel Usage</p>
            <p><strong>Amount:</strong> 100</p>
            <p><strong>Owner:</strong> 0xD0badeDE6214A40153e3e35ed1fD19487394cdE6</p>
            <p><strong>Expiration Date:</strong> 10 Days</p>
            <p><strong>Is Revoked:</strong> No</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditExchangePage;
