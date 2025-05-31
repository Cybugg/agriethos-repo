// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol"; // For toHexString, if generating ID on-chain

/**
 * @title AgriEthosProductLedger
 * @dev A smart contract to store immutable logs of verified farm products.
 * It tracks crop details, verification information, and a process log for each product.
 */
contract AgriEthosProductLedger {
    using Strings for uint256;

    // --- Structs ---

    struct CropDetails {
        string cropId; // Unique identifier for the crop
        address farmId; // Address of the farmer/farm entity
        string cropType;
        string farmingMethods; // e.g., "Organic", "Conventional"
        uint256 harvestDate;
        string geographicOrigin;
        // Add more farm-specific details as needed (e.g., seedType, soilConditions)
    }

    struct LogEntry {
        uint256 timestamp;
        string stage; // e.g., "Harvest", "Processing", "Storage", "Transport"
        string description; // e.g., "Stored at 5°C", "Transported by XYZ Logistics"
        string location; // GPS coordinates or address
        string additionalData; // Flexible field for temperature, weather, etc. (can be JSON string)
        address loggedBy; // Address of the entity logging this entry
    }

    struct VerifiedProduct {
        CropDetails cropInfo;
        address reviewerAddress; // Public address of the verifier
        uint256 verificationTimestamp;
        LogEntry[] processLog; // Array to store the immutable log of processing steps
        bool isVerified;
    }

    // --- State Variables ---

    mapping(string => VerifiedProduct) public products; // Mapping from cropId to VerifiedProduct
    string[] public productIds; // Array to keep track of all product IDs for easier iteration

    address public owner;
    mapping(address => bool) public authorizedReviewers;

    // --- Events ---

    event ProductVerified(
        string indexed cropId,
        address indexed farmId,
        address indexed reviewerAddress,
        uint256 verificationTimestamp
    );

    event ProcessLogAdded(
        string indexed cropId,
        uint256 timestamp,
        string stage,
        address loggedBy
    );

    event ReviewerAdded(address indexed reviewerAddress, address indexed addedBy);
    event ReviewerRemoved(address indexed reviewerAddress, address indexed removedBy);

    // --- Modifiers ---

    modifier onlyOwner() {
        require(msg.sender == owner, "AgriEthos: Caller is not the owner");
        _;
    }

    modifier onlyAuthorizedReviewer() {
        require(authorizedReviewers[msg.sender], "AgriEthos: Caller is not an authorized reviewer");
        _;
    }

    // --- Constructor ---

    constructor() {
        owner = msg.sender;
        // Optionally, add the deployer as an initial authorized reviewer
        authorizedReviewers[msg.sender] = true;
        emit ReviewerAdded(msg.sender, msg.sender);
    }

    // --- Reviewer Management Functions ---

    /**
     * @dev Adds a new authorized reviewer.
     * @param _reviewer The address of the reviewer to add.
     */
    function addReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != address(0), "AgriEthos: Invalid reviewer address");
        require(!authorizedReviewers[_reviewer], "AgriEthos: Reviewer already authorized");
        authorizedReviewers[_reviewer] = true;
        emit ReviewerAdded(_reviewer, msg.sender);
    }

    /**
     * @dev Removes an authorized reviewer.
     * @param _reviewer The address of the reviewer to remove.
     */
    function removeReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != address(0), "AgriEthos: Invalid reviewer address");
        require(authorizedReviewers[_reviewer], "AgriEthos: Reviewer not currently authorized");
        authorizedReviewers[_reviewer] = false;
        emit ReviewerRemoved(_reviewer, msg.sender);
    }

    // --- Core Logic Functions ---

    /**
     * @dev Internal function to generate a unique crop ID.
     * This is a simple example. For production, consider more robust off-chain ID generation
     * or a more sophisticated on-chain mechanism to ensure global uniqueness and prevent collisions.
     * @param _farmId The ID of the farm.
     * @param _cropType The type of the crop.
     * @param _harvestDate The harvest date of the crop.
     * @return A string representing the unique crop ID.
     */
    function _generateCropId(address _farmId, string memory _cropType, uint256 _harvestDate, uint256 _nonce) internal pure returns (string memory) {
        return string(abi.encodePacked(
            "CROP-",
            Strings.toHexString(uint256(keccak256(abi.encodePacked(_farmId, _cropType, _harvestDate, _nonce))))
        ));
    }

    /**
     * @dev Verifies and stores a new crop product. Called by an authorized reviewer.
     * @param _cropId The pre-generated unique ID for the crop (e.g., from QR code system).
     * @param _farmId The address of the farmer/farm.
     * @param _cropType Type of the crop.
     * @param _farmingMethods Farming methods used.
     * @param _harvestDate Timestamp of the harvest.
     * @param _geographicOrigin Origin of the crop.
     */
    function verifyAndStoreCrop(
        string memory _cropId, // It's often better to have IDs generated off-chain and passed in
        address _farmId,
        string memory _cropType,
        string memory _farmingMethods,
        uint256 _harvestDate,
        string memory _geographicOrigin
        // Add other CropDetails fields as parameters
    ) external onlyAuthorizedReviewer {
        require(bytes(_cropId).length > 0, "AgriEthos: Crop ID cannot be empty");
        require(bytes(products[_cropId].cropInfo.cropId).length == 0, "AgriEthos: Product ID already exists");
        require(_farmId != address(0), "AgriEthos: Invalid farm ID");

        CropDetails memory cropInfo = CropDetails({
            cropId: _cropId,
            farmId: _farmId,
            cropType: _cropType,
            farmingMethods: _farmingMethods,
            harvestDate: _harvestDate,
            geographicOrigin: _geographicOrigin
            // Initialize other fields
        });

        products[_cropId] = VerifiedProduct({
            cropInfo: cropInfo,
            reviewerAddress: msg.sender,
            verificationTimestamp: block.timestamp,
            processLog: new LogEntry[](0), // Initialize empty log
            isVerified: true
        });

        productIds.push(_cropId);

        emit ProductVerified(_cropId, _farmId, msg.sender, block.timestamp);
    }

    /**
     * @dev Adds a new log entry to a verified product's process history.
     * Consider adding role-based access control for who can log specific stages.
     * @param _cropId The ID of the crop to add the log to.
     * @param _stage The current stage of the product (e.g., "Processing", "Transport").
     * @param _description A description of the log entry.
     * @param _location Location relevant to this log entry.
     * @param _additionalData Any additional relevant data (e.g., JSON string with sensor readings).
     */
    function addProcessLog(
        string memory _cropId,
        string memory _stage,
        string memory _description,
        string memory _location,
        string memory _additionalData
    ) external { // Add authorization logic here if needed (e.g., only specific roles can log)
        require(bytes(products[_cropId].cropInfo.cropId).length != 0, "AgriEthos: Product does not exist");
        require(products[_cropId].isVerified, "AgriEthos: Product not verified");

        // Example authorization: only the farm owner can add logs initially, or specific roles.
        // This needs to be adapted based on your platform's specific roles and permissions.
        // require(msg.sender == products[_cropId].cropInfo.farmId || isAuthorizedForStage(msg.sender, _stage), "AgriEthos: Not authorized to log for this product/stage");

        LogEntry memory newLog = LogEntry({
            timestamp: block.timestamp,
            stage: _stage,
            description: _description,
            location: _location,
            additionalData: _additionalData,
            loggedBy: msg.sender
        });

        products[_cropId].processLog.push(newLog);
        emit ProcessLogAdded(_cropId, block.timestamp, _stage, msg.sender);
    }

    // --- Getter Functions ---

    /**
     * @dev Retrieves all details for a given crop ID.
     * @param _cropId The ID of the crop.
     * @return The VerifiedProduct struct.
     */
    function getProductDetails(string memory _cropId) external view returns (VerifiedProduct memory) {
        require(bytes(products[_cropId].cropInfo.cropId).length != 0, "AgriEthos: Product does not exist");
        return products[_cropId];
    }

    /**
     * @dev Retrieves the process log for a specific crop.
     * @param _cropId The ID of the crop.
     * @return An array of LogEntry structs.
     */
    function getProductLog(string memory _cropId) external view returns (LogEntry[] memory) {
        require(bytes(products[_cropId].cropInfo.cropId).length != 0, "AgriEthos: Product does not exist");
        return products[_cropId].processLog;
    }

    /**
     * @dev Checks if a product is verified.
     * @param _cropId The ID of the crop.
     * @return True if the product is verified, false otherwise.
     */
    function isProductVerified(string memory _cropId) external view returns (bool) {
        return products[_cropId].isVerified;
    }

    /**
     * @dev Retrieves a list of all product IDs stored in the contract.
     * @return An array of strings containing all product IDs.
     */
    function getAllProductIds() external view returns (string[] memory) {
        return productIds;
    }

    /**
     * @dev Retrieves the count of authorized reviewers.
     * @return The number of authorized reviewers.
     */
    function getAuthorizedReviewersCount() external view returns (uint256) {
        // This is not efficient for a large number of reviewers.
        // For a large list, consider managing it off-chain or using a different pattern.
        uint256 count = 0;
        // This part would require iterating through known reviewer addresses if you don't store them in an array.
        // For simplicity, this function is a placeholder if you need such a count.
        // A more practical approach for on-chain counting would be to maintain a counter variable
        // that increments/decrements in addReviewer/removeReviewer.
        // However, the primary use of authorizedReviewers is the mapping check.
        revert("AgriEthos: getAuthorizedReviewersCount not fully implemented for on-chain iteration without an array of reviewers.");
        return count; // Unreachable
    }
}