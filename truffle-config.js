module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Port (match with Ganache GUI or CLI)
      network_id: "*",       // Any network (default: none)
    },
  },
  // Other configuration options
  compilers: {
    solc: {
      version: "0.8.1",    // Specify the Solidity compiler version
    },
  },
};
