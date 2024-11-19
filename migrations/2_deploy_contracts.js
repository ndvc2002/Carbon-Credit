// migrations/2_deploy_contracts.js
const CarbonCreditExchange = artifacts.require("CarbonCreditExchange");

module.exports = function (deployer) {
    deployer.deploy(CarbonCreditExchange);
};
