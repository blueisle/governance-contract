pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../abstract/EnvConstants.sol";
import "../abstract/AEnvStorage.sol";


contract EnvStorageImp is AEnvStorage, EnvConstants {
    using SafeMath for uint256;

    function initialize(
        uint256 _blocksPer, 
        uint256 _ballotDurationMin,
        uint256 _ballotDurationMax,
        uint256 _stakingMin,
        uint256 _stakingMax,
        uint256 _gasPrice,
        uint256 _maxIdleBlockInterval
    ) public onlyOwner {
        uint256 blocksPer = getBlocksPer();
        uint256 ballotDurationMin = getBallotDurationMin();
        uint256 ballotDurationMax = getBallotDurationMax();
        uint256 stakingMin = getStakingMin();
        uint256 stakingMax = getStakingMax();
        uint256 gasPrice = getGasPrice();
        uint256 maxIdleBlockInterval = getMaxIdleBlockInterval();
        require(_blocksPer != 0 || blocksPer != 0, "invalid blocksPer values");
        require(_ballotDurationMin != 0 || ballotDurationMin != 0, "invalid ballotDurationMin values");
        require(_ballotDurationMax != 0 || ballotDurationMax != 0, "invalid ballotDurationMax values");
        require(_stakingMin != 0 || stakingMin != 0, "invalid stakingMin values");
        require(_stakingMax != 0 || stakingMax != 0, "invalid stakingMax values");
        require(_gasPrice != 0 || gasPrice != 0, "invalid gasPrice values");
        require(_maxIdleBlockInterval != 0 || maxIdleBlockInterval != 0, "invalid max Idle Block Interval values");
        if (blocksPer == 0) {
            setUint(BLOCKS_PER_NAME, _blocksPer);
        }
        if (ballotDurationMin == 0) {
            setUint(BALLOT_DURATION_MIN_NAME, _ballotDurationMin);
        }
        if (ballotDurationMax == 0) {
            setUint(BALLOT_DURATION_MAX_NAME, _ballotDurationMax);
        }
        if (stakingMin == 0) {
            setUint(STAKING_MIN_NAME, _stakingMin);
        }
        if (stakingMax == 0) {
            setUint(STAKING_MAX_NAME, _stakingMax);
        }
        if (gasPrice == 0) {
            setUint(GAS_PRICE_NAME, _gasPrice);
        }
        if (maxIdleBlockInterval == 0) {
            setUint(MAX_IDLE_BLOCK_INTERVAL_NAME, _maxIdleBlockInterval);
        }
    }

    function getBlocksPer() public view returns (uint256) {
        return getUint(BLOCKS_PER_NAME);
    }

    function getBallotDurationMin() public view returns (uint256) {
        return getUint(BALLOT_DURATION_MIN_NAME);
    }

    function getBallotDurationMax() public view returns (uint256) {
        return getUint(BALLOT_DURATION_MAX_NAME);
    }

    function getStakingMin() public view returns (uint256) {
        return getUint(STAKING_MIN_NAME);
    }

    function getStakingMax() public view returns (uint256) {
        return getUint(STAKING_MAX_NAME);
    }

    function getGasPrice() public view returns (uint256) {
        return getUint(GAS_PRICE_NAME);
    }

    function getMaxIdleBlockInterval() public view returns (uint256) {
        return getUint(MAX_IDLE_BLOCK_INTERVAL_NAME);
    }

    function setBlocksPer(uint256 _value) public onlyGov { 
        setUint(BLOCKS_PER_NAME, _value);
    }

    function setBallotDurationMin(uint256 _value) public onlyGov { 
        setUint(BALLOT_DURATION_MIN_NAME, _value);
    }

    function setBallotDurationMax(uint256 _value) public onlyGov { 
        setUint(BALLOT_DURATION_MAX_NAME, _value);
    }

    function setStakingMin(uint256 _value) public onlyGov { 
        setUint(STAKING_MIN_NAME, _value);
    }

    function setStakingMax(uint256 _value) public onlyGov { 
        setUint(STAKING_MAX_NAME, _value);
    }

    function setGasPrice(uint256 _value) public onlyGov { 
        setUint(GAS_PRICE_NAME, _value);
    }
    
    function setMaxIdleBlockInterval(uint256 _value) public onlyGov { 
        setUint(MAX_IDLE_BLOCK_INTERVAL_NAME, _value);
    }

    function setBlocksPerByBytes(bytes _value) public onlyGov { 
        setBlocksPer(toUint(_value));
    }

    function setBallotDurationMinByBytes(bytes _value) public onlyGov { 
        setBallotDurationMin(toUint(_value));
    }

    function setBallotDurationMaxByBytes(bytes _value) public onlyGov { 
        setBallotDurationMax(toUint(_value));
    }

    function setStakingMinByBytes(bytes _value) public onlyGov { 
        setStakingMin(toUint(_value));
    }

    function setStakingMaxByBytes(bytes _value) public onlyGov { 
        setStakingMax(toUint(_value));
    }

    function setGasPriceByBytes(bytes _value) public onlyGov { 
        setGasPrice(toUint(_value));
    }

    function setMaxIdleBlockIntervalByBytes(bytes _value) public onlyGov { 
        setMaxIdleBlockInterval(toUint(_value));
    }

    // function getTestInt() public view returns (int256) {
    //     return getInt(TEST_INT);
    // }

    // function getTestAddress() public view returns (address) {
    //     return getAddress(TEST_ADDRESS);
    // }

    // function getTestBytes32() public view returns (bytes32) {
    //     return getBytes32(TEST_BYTES32);
    // }

    // function getTestBytes() public view returns (bytes) {
    //     return getBytes(TEST_BYTES);
    // }

    // function getTestString() public view returns (string) {
    //     return getString(TEST_STRING);
    // }

    // function setTestIntByBytes(bytes _value) public onlyGov { 
    //     setInt(TEST_INT, toInt(_value));
    // }

    // function setTestAddressByBytes(bytes _value) public onlyGov { 
    //     setAddress(TEST_ADDRESS, toAddress(_value));
    // }

    // function setTestBytes32ByBytes(bytes _value) public onlyGov { 
    //     setBytes32(TEST_BYTES32, toBytes32(_value));
    // }

    // function setTestBytesByBytes(bytes _value) public onlyGov { 
    //     setBytes(TEST_BYTES, _value);
    // }

    // function setTestStringByBytes(bytes _value) public onlyGov { 
    //     setString(TEST_STRING, string(_value));
    // }

    function toBytes32(bytes memory _input) internal pure returns (bytes32 _output) {
        assembly {
            _output := mload(add(_input, 32))
        }
    }

    function toInt(bytes memory _input) internal pure returns (int256 _output) {
        assembly {
            _output := mload(add(_input, 32))
        }
    }

    function toUint(bytes memory _input) internal pure returns (uint256 _output) {
        assembly {
            _output := mload(add(_input, 32))
        }
    }

    function toAddress(bytes memory _input) internal pure returns (address _output) {
        assembly {
            _output := mload(add(_input, 20))
        }
    }
}