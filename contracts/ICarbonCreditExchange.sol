// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ICarbonCreditExchange {
    function marketplaceTransfer(uint _id, address _to) external;
    function getCreditDetails(uint _id) external view returns (uint, string memory, uint, address, uint, bool);
}
