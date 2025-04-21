// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./DistributionRegistry.sol";

/**
 * @title RetailRegistry
 * @dev Manages retail records for distributed products
 */
contract RetailRegistry is DistributionRegistry {
    // Retail data structure
    struct RetailRecord {
        uint256 id;
        uint256 distributionBatchId;
        string retailer;
        string storeLocation;
        uint256 receivedDate;
        uint256 shelfDate;
        string displayCode; // For in-store QR codes
        address recordedBy;
    }
    
    // Storage
    mapping(uint256 => RetailRecord) public retailRecords;
    mapping(string => uint256) public retailRecordByCode;
    uint256 public retailRecordCount;
    
    // Events
    event RetailRecorded(uint256 indexed retailId, uint256 indexed distributionId, string displayCode);
    
    // Functions
    function recordRetailDelivery(
        uint256 _distributionBatchId,
        string memory _retailer,
        string memory _storeLocation,
        string memory _displayCode
    ) public returns (uint256) {
        require(distributionBatches[_distributionBatchId].id != 0, "Distribution batch does not exist");
        require(distributionBatches[_distributionBatchId].status == ShippingStatus.Delivered, "Shipment not delivered yet");
        require(retailRecordByCode[_displayCode] == 0, "Display code already exists");
        
        uint256 processingBatchId = distributionBatches[_distributionBatchId].processingBatchId;
        uint256 harvestBatchId = processingBatches[processingBatchId].harvestBatchId;
        uint256 cropId = harvestBatches[harvestBatchId].cropId;
        
        require(
            admins[msg.sender] || 
            verifiers[msg.sender],
            "Not authorized to record retail delivery" 
        );
        
        retailRecordCount++;
        
        retailRecords[retailRecordCount] = RetailRecord({
            id: retailRecordCount,
            distributionBatchId: _distributionBatchId,
            retailer: _retailer,
            storeLocation: _storeLocation,
            receivedDate: block.timestamp,
            shelfDate: block.timestamp, // Assuming immediate shelving, can be updated later
            displayCode: _displayCode,
            recordedBy: msg.sender
        });
        
        retailRecordByCode[_displayCode] = retailRecordCount;
        
        // Update crop status
        updateCropStatus(cropId, CropStatus.Sold);
        
        emit RetailRecorded(retailRecordCount, _distributionBatchId, _displayCode);
        
        return retailRecordCount;
    }
}