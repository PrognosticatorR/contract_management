import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import secrets from './.secret.testnet.json'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    'testnet-eth': {
      accounts: { mnemonic: secrets.mnemonic },
      url: secrets.node_url,
      chainId: 5,
    },
    local: {
      accounts: { mnemonic: secrets.mnemonic_local },
      url: secrets.node_local,
      chainId: 1337,
    },
  },
  paths: {
    artifacts: './client/src/artifacts',
  },
  namedAccounts: {
    deployer: {
      default: 2, // here this will by default take the first account as deployer
      testnet: 2,
    },
    signer: {
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
      testnet: 1,
    },
  },
}

export default config
