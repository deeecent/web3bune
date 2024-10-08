// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Web3bune is ERC1155, Ownable {
    // Errors
    error NonexistentPost();
    error InvalidFee();
    error InsufficientFunds();
    error NotOwner();

    // Structs and data
    struct Post {
        string tokenURI;
        address payable author;
        uint256 price;
        uint256 feeBasisPoints;
        uint256 aggFeeBasisPoints;
    }

    // Events
    event PostCreated(
        address indexed from,
        uint256 index,
        string tokenURI,
        uint256 price,
        uint256 feeBasisPoints,
        uint256 aggFeeBasisPoints
    );

    event PostUpdated(
        address indexed from,
        uint256 index,
        string tokenURI,
        uint256 price,
        uint256 feeBasisPoints,
        uint256 aggFeeBasisPoints
    );

    uint256 constant PAGE_SIZE = 100;

    Post[] internal _posts;
    mapping(address => uint256[]) internal _addressToPostIds;
    address payable internal _protocolFeeReceiver;

    modifier postExists(uint256 index) {
        if (index >= _posts.length) {
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
        uint256 feeBasisPoints,
        uint256 aggFeeBasisPoints
    ) public {
        if (feeBasisPoints + aggFeeBasisPoints > 10000) {
            revert InvalidFee();
        }

        _posts.push(
            Post(
                tokenURI,
                payable(msg.sender),
                price,
                feeBasisPoints,
                aggFeeBasisPoints
            )
        );
        _addressToPostIds[msg.sender].push(_posts.length - 1);

        emit PostCreated(
            msg.sender,
            _posts.length - 1,
            tokenURI,
            price,
            feeBasisPoints,
            aggFeeBasisPoints
        );
    }

    function updatePost(
        uint256 index,
        string calldata tokenURI,
        uint256 price,
        uint256 feeBasisPoints,
        uint256 aggFeeBasisPoints
    ) public postExists(index) {
        Post storage post = _posts[index];

        if (msg.sender != post.author) {
            revert NotOwner();
        }

        if (feeBasisPoints + aggFeeBasisPoints > 10000) {
            revert InvalidFee();
        }

        post.tokenURI = tokenURI;
        post.price = price;
        post.feeBasisPoints = feeBasisPoints;
        post.aggFeeBasisPoints = aggFeeBasisPoints;

        emit PostUpdated(
            msg.sender,
            index,
            tokenURI,
            price,
            feeBasisPoints,
            aggFeeBasisPoints
        );
    }

    function mint(
        address payable aggregator,
        address account,
        uint256 index
    ) public payable {
        mintBatch(aggregator, account, index, 1);
    }

    function mintBatch(
        address payable aggregator,
        address account,
        uint256 index,
        uint256 amount
    ) public payable postExists(index) {
        Post memory post = _posts[index];
        uint256 total = post.price * amount;
        if (msg.value < total) {
            revert InsufficientFunds();
        }

        uint256 protocolFee = (msg.value * post.feeBasisPoints) / 10_000;
        uint256 aggregatorFee = aggregator == address(0)
            ? 0
            : (msg.value * post.aggFeeBasisPoints) / 10_000;

        post.author.transfer(msg.value - protocolFee - aggregatorFee);
        aggregator.transfer(aggregatorFee);
        _protocolFeeReceiver.transfer(protocolFee);

        _mint(account, index, amount, "");
    }

    function uri(
        uint256 id
    ) public view virtual override postExists(id) returns (string memory) {
        Post memory post = _posts[id];
        return post.tokenURI;
    }

    function getPost(
        uint256 id
    ) public view virtual postExists(id) returns (Post memory) {
        return _posts[id];
    }

    function listPostsByAccount(
        address account,
        uint256 page
    ) public view returns (Post[PAGE_SIZE] memory) {
        Post[PAGE_SIZE] memory posts;
        uint256 offset = page * PAGE_SIZE;
        uint256[] memory postIds = _addressToPostIds[account];

        for (uint256 i = 0; i < PAGE_SIZE && i + offset < postIds.length; i++) {
            posts[i] = _posts[postIds[i + offset]];
        }

        return posts;
    }
}
