const CarbonNftMarketplace = artifacts.require("CarbonNftMarketplace");
const CarbonCreditExchange = artifacts.require("CarbonCreditExchange");

module.exports = async function(deployer) {
    const carbonCreditExchange = await CarbonCreditExchange.deployed();
    await deployer.deploy(CarbonNftMarketplace, carbonCreditExchange.address);
};
 