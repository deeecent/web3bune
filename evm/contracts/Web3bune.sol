// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Web3bune is ERC1155, Ownable {
    // Errors
    error NonexistentPost();
    error InvalidFee();

    // Structs and data
    struct Post {
        string tokenURI;
        uint256 price;
        uint256 feeBasisPoints;
    }

    // Events
    event PostCreated(
        address indexed from,
        uint256 index,
        string tokenURI,
        uint256 price,
        uint256 feeBasisPoints
    );

    Post[] internal _posts;
    mapping(address => uint256[]) internal _addressToPostIds;
    address payable internal _protocolFeeReceiver;

    modifier postExists(uint256 index) {
        if (_posts.length > index) {
            revert NonexistentPost();
        }
        _;
    }

    constructor(
        address initialOwner,
        address payable protocolFeeReceiver
    ) ERC1155("") Ownable(initialOwner) {
        _protocolFeeReceiver = protocolFeeReceiver;
    }

    function createPost(
        string calldata tokenURI,
        uint256 price,
        uint256 feeBasisPoints
    ) public {
        if (feeBasisPoints > 10000) {
            revert InvalidFee();
        }
        _posts.push(Post(tokenURI, price, feeBasisPoints));
        _addressToPostIds[msg.sender].push(_posts.length - 1);

        emit PostCreated(
            msg.sender,
            _posts.length - 1,
            tokenURI,
            price,
            feeBasisPoints
        );
    }

    function mint(
        address account,
        uint256 index
    ) public payable postExists(index) {
        Post memory post = _posts[index];
        _mint(account, index, 1, "");
    }

    function mintBatch(
        address account,
        uint256 index,
        uint256 amount
    ) public payable postExists(index) {
        Post memory post = _posts[index];
        _mint(account, index, amount, "");
    }

    /*
    function listPostsByAccount(
        address account
    ) public view proposalExists(account, index) returns (Proposal memory) {
        return _proposals[account][index];
    }
    */
}
