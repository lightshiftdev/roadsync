pragma solidity 0.8.22;

import {EIP712} from "lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract CarSimulation is EIP712 {
    using ECDSA for bytes32;

    uint256 constant MIN_STAKE = 1 ether;
    uint256 constant SLASH_AMOUNT = 0.1 ether;
    uint256 constant JUDGE_QUORUM_MIN = 2;
    uint256 constant DEFAULT_BALANCE = 1 ether;

    // Mint approval EIP712 TypeHash
    bytes32 public constant BRIBE_TYPEHASH = keccak256("Bribe(address from,address to,uint256 amount,uint256 nonce)");
    bytes32 public constant SETTLE_TYPEHASH = keccak256("Settle(address from,address to,uint256 amount,uint256 nonce)");

    event Slashed(address indexed user, uint256 amount);

    struct Bribe {
        uint256 amount;
        bool settled;
        uint8 user1Votes;
        uint8 user2Votes;
    }

    struct Params {
        address user1;
        address user2;
        uint256 amount;
        uint256 nonce;
    }

    //
    // state
    //
    mapping(address => bool) instantiated;
    mapping(address => uint256) balances;
    mapping(bytes32 => Bribe) public bribes;
    mapping(bytes32 => mapping(address => bool)) votes;
    mapping(uint256 => uint256) yay;
    mapping(uint256 => uint256) nay;

    //
    // constructor
    //
    constructor() EIP712("CarSimulation", "1.0.0") {}

    //
    // API
    //
    function balanceOf(address u) external view returns (uint256) {
        if (instantiated[u]) {
            return balances[u];
        } else {
            return DEFAULT_BALANCE;
        }
    }

    function settle(Params memory params, bytes calldata sig1, bytes calldata sig2) external {
        _instantiate(params.user1);
        _instantiate(params.user2);

        bytes32 hash = computeHash(SETTLE_TYPEHASH, params);

        // verify both users accepted the settlement
        require(_verify(hash, sig1, params.user1));
        require(_verify(hash, sig2, params.user2));

        balances[params.user1] -= params.amount;
        balances[params.user2] += params.amount;

        bytes32 k = key(params.user1, params.user2, params.nonce);
        Bribe storage bribe = bribes[k];
        bribe.amount = params.amount;
        bribe.settled = true;
    }

    function judge(
        Params memory params,
        address settler,
        bool yay_or_nay,
        bytes calldata bribe1,
        bytes calldata bribe2,
        bytes calldata settle_sig
    ) external {
        _instantiate(params.user1);
        _instantiate(params.user2);

        bytes32 k = key(params.user1, params.user2, params.nonce);

        require(!votes[k][msg.sender]);

        // ensure this bribe is not setled yet
        Bribe storage bribe = bribes[k];
        require(!bribe.settled);

        // validate both users accepted a bribe deal
        {
            bytes32 bribe_hash = computeHash(BRIBE_TYPEHASH, params);
            require(_verify(bribe_hash, bribe1, params.user1));
            require(_verify(bribe_hash, bribe2, params.user2));
        }

        // validate one of the users tried to settle it, and whether or not to vote for or against it
        {
            bytes32 settle_hash = computeHash(SETTLE_TYPEHASH, params);
            require(_verify(settle_hash, settle_sig, settler));
        }

        if (yay_or_nay && settler == params.user1 || !yay_or_nay && settler == params.user2) {
            // voted in favor of user1's settle, or against user2's settle. this is a vote for user1
            bribe.user1Votes += 1;
        } else {
            // voted in favor of user2's settle, or against user1's settle. this is a vote for user2
            bribe.user2Votes += 1;
        }

        votes[k][msg.sender] = true;

        bribe.settled = true;
        if (bribe.user1Votes + bribe.user2Votes == JUDGE_QUORUM_MIN) {
            if (bribe.user1Votes > bribe.user2Votes) {
                uint256 amount = _min(balances[params.user2], SLASH_AMOUNT);
                balances[params.user2] = balances[params.user2] - amount;
                emit Slashed(params.user2, amount);
            } else {
                uint256 amount = _min(balances[params.user1], SLASH_AMOUNT);
                balances[params.user1] = balances[params.user1] - amount;
                emit Slashed(params.user1, amount);
            }
        }
    }

    function _verify(bytes32 _digest, bytes memory _sig, address user) internal pure returns (bool) {
        return user == _digest.recover(_sig);
    }

    function key(address u1, address u2, uint256 nonce) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(u1, u2, nonce));
    }

    function computeHash(bytes32 typehash, Params memory params) internal view returns (bytes32) {
        return
            _hashTypedDataV4(keccak256(abi.encode(typehash, params.user1, params.user2, params.amount, params.nonce)));
    }

    function _instantiate(address u) internal {
        if (instantiated[u]) return;
        instantiated[u] = true;
        balances[u] = DEFAULT_BALANCE;
    }

    function _min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }
}
