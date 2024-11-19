// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CarbonCreditExchange {
    struct Credit {
        uint id;
        string project;
        uint amount;
        address owner;
        uint expirationDate;
        bool isRevoked;
    }

    mapping(uint => Credit) public credits;
    uint public nextCreditId;
    address public marketplaceContract;
    address public owner;

    event CreditIssued(uint id, string project, uint amount, address indexed owner);
    event CreditTransferred(uint id, address indexed from, address indexed to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setMarketplaceContract(address _marketplace) public onlyOwner {
        marketplaceContract = _marketplace;
    }

    function issueCredit(string memory _project, uint _amount, uint _expirationPeriod) public {
        require(_amount > 0, "Amount must be greater than zero");

        credits[nextCreditId] = Credit({
            id: nextCreditId,
            project: _project,
            amount: _amount,
            owner: msg.sender,
            expirationDate: block.timestamp + _expirationPeriod,
            isRevoked: false
        });

        emit CreditIssued(nextCreditId, _project, _amount, msg.sender);
        nextCreditId++;
    }

    function transferCredit(uint _id, address _to) public {
        require(_id < nextCreditId, "Credit ID does not exist");
        require(_to != address(0), "Invalid recipient address");

        Credit storage credit = credits[_id];
        require(credit.owner == msg.sender, "Only the owner can transfer the credit");
        require(!credit.isRevoked, "Cannot transfer a revoked credit");

        credit.owner = _to;

        emit CreditTransferred(_id, msg.sender, _to);
    }

    function marketplaceTransfer(uint _id, address _to) public {
        require(msg.sender == marketplaceContract, "Only the marketplace contract can call this function");
        require(_id < nextCreditId, "Credit ID does not exist");
        require(_to != address(0), "Invalid recipient address");

        Credit storage credit = credits[_id];
        require(!credit.isRevoked, "Cannot transfer a revoked credit");

        address previousOwner = credit.owner;
        credit.owner = _to;

        emit CreditTransferred(_id, previousOwner, _to);
    }

    function getCreditDetails(uint _id) public view returns (uint, string memory, uint, address, uint, bool) {
        require(_id < nextCreditId, "Credit ID does not exist");
        Credit memory credit = credits[_id];
        return (credit.id, credit.project, credit.amount, credit.owner, credit.expirationDate, credit.isRevoked);
    }
}
