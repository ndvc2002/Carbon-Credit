// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ICarbonCreditExchange.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonNftMarketplace is ERC721URIStorage, Ownable {
    struct NFT {
        uint tokenId;
        uint creditId;
        uint price;
        address seller;
        bool isAvailable;
    }

    ICarbonCreditExchange public carbonCreditExchange;
    mapping(uint => NFT) public nfts;
    uint public nextTokenId;

    event NFTListed(uint tokenId, uint creditId, uint price, address indexed seller);
    event NFTSold(uint tokenId, uint creditId, uint price, address indexed buyer);

    constructor(address _carbonCreditExchange) ERC721("CarbonNFT", "CNFT") {
        carbonCreditExchange = ICarbonCreditExchange(_carbonCreditExchange);
    }

    function listNFT(uint _creditId, uint _price, string memory _tokenURI) public {
        require(_price > 0, "Price must be greater than zero");

        uint tokenId = nextTokenId;
        nfts[tokenId] = NFT({
            tokenId: tokenId,
            creditId: _creditId,
            price: _price,
            seller: msg.sender,
            isAvailable: true
        });

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI); // This function is now part of ERC721URIStorage

        nextTokenId++;
        emit NFTListed(tokenId, _creditId, _price, msg.sender);
    }

    function buyNFT(uint _tokenId) public payable {
        NFT storage nft = nfts[_tokenId];
        require(nft.isAvailable, "NFT is not available for sale");
        require(msg.value >= nft.price, "Insufficient funds to buy NFT");

        payable(nft.seller).transfer(msg.value);
        carbonCreditExchange.marketplaceTransfer(nft.creditId, msg.sender);

        nft.isAvailable = false;
        _transfer(nft.seller, msg.sender, _tokenId);

        emit NFTSold(_tokenId, nft.creditId, nft.price, msg.sender);
    }
}
