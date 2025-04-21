// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../certification/CertificationRegistry.sol";

/**
 * @title HarvestRegistry
 * @dev Manages harvest records for crops
 */
contract HarvestRegistry is CertificationRegistry {
    // Harvest data structure
    struct HarvestBatch {
        uint256 id;
        uint256 cropId;
        uint256 quantity; // in kg or appropriate unit
        uint256 harvestDate;
        string quality;
        string batchCode; // For QR code generation
        uint256[] processingBatches;
        address recordedBy;
    }
    
    // Storage
    mapping(uint256 => HarvestBatch) public harvestBatches;
    mapping(string => uint256) public harvestBatchByCode;
    uint256 public harvestBatchCount;
    
    // Events
    event HarvestRecorded(uint256 indexed harvestId, uint256 indexed cropId, string batchCode);
    
    // Functions
    function recordHarvest(
        uint256 _cropId,
        uint256 _quantity,
        string memory _quality,
        string memory _batchCode
    ) public cropExists(_cropId) returns (uint256) {
        uint256 farmId = cropToFarm[_cropId];
        require(
            farmToFarmer[farmId] == farmerByAddress[msg.sender] || 
            admins[msg.sender],
            "Only farm owner or admin can record harvest"
        );
        require(harvestBatchByCode[_batchCode] == 0, "Batch code already exists");
        
        // Update crop status
        updateCropStatus(_cropId, CropStatus.Harvested);
        
        harvestBatchCount++;
        
        harvestBatches[harvestBatchCount] = HarvestBatch({
            id: harvestBatchCount,
            cropId: _cropId,
            quantity: _quantity,
            harvestDate: block.timestamp,
            quality: _quality,
            batchCode: _batchCode,
            processingBatches: new uint256[](0),
            recordedBy: msg.sender
        });
        
        harvestBatchByCode[_batchCode] = harvestBatchCount;
        
        // Add harvest to crop's harvests
        string memory harvestKey = string(abi.encodePacked("harvest_", _uint2str(harvestBatchCount)));
        _setCropDetail(_cropId, harvestKey, "true");
        
        emit HarvestRecorded(harvestBatchCount, _cropId, _batchCode);
        
        return harvestBatchCount;
    }
    
    // Internal function to add processing batch to a harvest
    function _addProcessingToHarvest(uint256 _harvestBatchId, uint256 _processingBatchId) internal {
        require(harvestBatches[_harvestBatchId].id != 0, "Harvest batch does not exist");
        harvestBatches[_harvestBatchId].processingBatches.push(_processingBatchId);
    }
}