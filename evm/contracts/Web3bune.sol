// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Web3bune is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ERC1155Upgradeable
{
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
        uint256 createdAt;
        uint256 updatedAt;
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

    address payable public protocolFeeReceiver;
    Post[] public posts;

    mapping(address => uint256[]) internal _addressToPostIds;

    modifier postExists(uint256 index) {
        if (index >= posts.length) {
            revert NonexistentPost();
        }
        _;
    }

    function initialize(
        address payable protocolFeeReceiver_
    ) public initializer {
        protocolFeeReceiver = protocolFeeReceiver_;
        __Ownable_init(msg.sender);
        __ERC1155_init("");
        __UUPSUpgradeable_init();
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function _authorizeUpgrade(address) internal virtual override onlyOwner {}

    function createPost(
        string calldata tokenURI,
        uint256 price,
        uint256 feeBasisPoints,
        uint256 aggFeeBasisPoints
    ) public {
        if (feeBasisPoints + aggFeeBasisPoints > 10000) {
            revert InvalidFee();
        }

        posts.push(
            Post(
                tokenURI,
                payable(msg.sender),
                price,
                feeBasisPoints,
                aggFeeBasisPoints,
                block.timestamp,
                block.timestamp
            )
        );
        _addressToPostIds[msg.sender].push(posts.length - 1);

        emit PostCreated(
            msg.sender,
            posts.length - 1,
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
        Post storage post = posts[index];

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
        post.updatedAt = block.timestamp;

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
        Post memory post = posts[index];
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
        protocolFeeReceiver.transfer(protocolFee);

        _mint(account, index, amount, "");
    }

    function uri(
        uint256 id
    ) public view virtual override postExists(id) returns (string memory) {
        Post memory post = posts[id];
        return post.tokenURI;
    }

    function listPostsByAccount(
        address account,
        uint256 page
    ) public view returns (Post[PAGE_SIZE] memory pagePosts) {
        uint256 offset = page * PAGE_SIZE;
        uint256[] memory postIds = _addressToPostIds[account];

        for (uint256 i = 0; i < PAGE_SIZE && i + offset < postIds.length; i++) {
            pagePosts[i] = posts[postIds[i + offset]];
        }
    }
}
