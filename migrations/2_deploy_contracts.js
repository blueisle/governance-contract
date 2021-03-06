
const Registry = artifacts.require('Registry.sol');
const Staking = artifacts.require('Staking.sol');
const BallotStorage = artifacts.require('BallotStorage.sol');
const EnvStorage = artifacts.require('EnvStorage.sol');
const EnvStorageImp = artifacts.require('EnvStorageImp.sol');
const GovImp = artifacts.require('GovImp.sol');
const Gov = artifacts.require('Gov.sol');

const fs = require('fs');
const Web3 = require('web3');

// config file
const config = require('config');
// const ropstenConfig = config.get('ropsten')
const metaTestnetConfig = config.get('metadiumTestnet');

// eslint-disable-next-line max-len
const enode = '0x6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0';
const name = 'miner';
const ip = '127.0.0.1';
const port = 8542;
const memo = 'memo';

const web3 = new Web3(new Web3.providers.HttpProvider(metaTestnetConfig.provider));
const amount = web3.utils.toWei('1', 'ether');

async function deploy (deployer, network, accounts) {
  let contracts = {};

  deployer.then(async () => {
    // Deploy contracts
    contracts = await deployContracts(deployer, network, accounts);

    const [owner,authority1,authrity2,mainternance,rewardpool] = accounts;

    // Setup contracts
    await basicRegistrySetup(contracts);

    //Registry Maintenance / RewardPool Address
    console.log('registry Maintenance address :',mainternance );
    await contracts.registry.setContractDomain('Maintenance', mainternance,{from: owner});
    
    console.log('registry RewardPool address :',rewardpool );
    await contracts.registry.setContractDomain('RewardPool', rewardpool,{from: owner});
    
    // Initialize staking contract
    console.log('Initialize staking');
    await contracts.staking.deposit({ value: amount, from: accounts[0].toString() });

    // Initialize gov contract
    console.log('Initialize governance');
    await contracts.gov.init(contracts.registry.address, contracts.govImp.address, amount, name, enode, ip, port);

    //Initialize envStorage contract variables
    let iEnvStorage = EnvStorageImp.at(contracts.envStorage.address);
    const _defaultBlocksPer = 100;
    const _defaultBallotDurationMin = 86400;
    const _defaultBallotDurationMax = 604800;
    const _defaultStakingMin = 4980000000000000000000000;
    const _defaultStakingMax = 39840000000000000000000000;
    const _defaultGasPrice = 80000000000;
    const _defaultMaxIdleBlockInterval =  5;

    await iEnvStorage.initialize(
      _defaultBlocksPer,
      _defaultBallotDurationMin,
      _defaultBallotDurationMax,
      _defaultStakingMin,
      _defaultStakingMax,
      _defaultGasPrice,
      _defaultMaxIdleBlockInterval
      );

    // Write contract address to contract.json
    await writeToContractsJson(contracts);
  });
}

async function deployContracts (deployer, network, accounts) {
  // proxy create metaID instead user for now. Because users do not have enough fee.
  const contracts = {
    registry: Object,
    govImp: Object,
    gov: Object,
    staking: Object,
    ballotStorage: Object,
    envStorageImp: Object,
    envStorage: Object,
  };

  contracts.registry = await deployer.deploy(Registry);
  contracts.staking = await deployer.deploy(Staking, contracts.registry.address, "");
  contracts.ballotStorage = await deployer.deploy(BallotStorage, contracts.registry.address);
  contracts.envStorageImp = await deployer.deploy(EnvStorageImp);
  contracts.envStorage = await deployer.deploy(EnvStorage, contracts.registry.address, contracts.envStorageImp.address);
  contracts.govImp = await deployer.deploy(GovImp);
  contracts.gov = await deployer.deploy(Gov);

  return contracts;
}

async function basicRegistrySetup (contracts) {
  await contracts.registry.setContractDomain('Staking', contracts.staking.address);
  await contracts.registry.setContractDomain('BallotStorage', contracts.ballotStorage.address);
  await contracts.registry.setContractDomain('EnvStorage', contracts.envStorage.address);
  await contracts.registry.setContractDomain('GovernanceContract', contracts.gov.address);
}

async function writeToContractsJson (contracts) {
  console.log('Writing Contract Address To contracts.json');

  const contractData = {};
  contractData.REGISTRY_ADDRESS = contracts.registry.address;
  contractData.STAKING_ADDRESS = contracts.staking.address;
  contractData.ENV_STORAGE_ADDRESS = contracts.envStorage.address;
  contractData.BALLOT_STORAGE_ADDRESS = contracts.ballotStorage.address;
  contractData.GOV_ADDRESS = contracts.gov.address;

  fs.writeFile('contracts.json', JSON.stringify(contractData), 'utf-8', function (e) {
    if (e) {
      console.log(e);
    } else {
      console.log('contracts.json updated!');
    }
  });
}

module.exports = deploy;
