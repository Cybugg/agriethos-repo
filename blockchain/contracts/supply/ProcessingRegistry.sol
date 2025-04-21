// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./HarvestRegistry.sol";

/**
 * @title ProcessingRegistry
 * @dev Manages processing records for harvested crops
 */
contract ProcessingRegistry is HarvestRegistry {
    // Processing data structure
    struct ProcessingBatch {
        uint256 id;
        uint256 harvestBatchId;
        string processingMethod;
        string facility;
        uint256 processingDate;
        ProcessingStatus status;
        string batchCode;
        uint256[] distributionBatches;
        address recordedBy;
    }
    
    // Storage
    mapping(uint256 => ProcessingBatch) public processingBatches;
    mapping(string => uint256) public processingBatchByCode;
    uint256 public processingBatchCount;
    
    // Events
    event ProcessingRecorded(uint256 indexed processingId, uint256 indexed harvestId, string batchCode);
    
    // Functions
    function recordProcessing(
        uint256 _harvestBatchId,
        string memory _processingMethod,
        string memory _facility,
        string memory _batchCode
    ) public returns (uint256) {
        require(harvestBatches[_harvestBatchId].id != 0, "Harvest batch does not exist");
        require(processingBatchByCode[_batchCode] == 0, "Processing batch code already exists");
        
        uint256 cropId = harvestBatches[_harvestBatchId].cropId;
        uint256 farmId = cropToFarm[cropId];
        
        require(
            admins[msg.sender] || 
            verifiers[msg.sender] || 
            farmToFarmer[farmId] == farmerByAddress[msg.sender],
            "Unauthorized to record processing"
        );
        
        processingBatchCount++;
        
        processingBatches[processingBatchCount] = ProcessingBatch({
            id: processingBatchCount,
            harvestBatchId: _harvestBatchId,
            processingMethod: _processingMethod,
            facility: _facility,
            processingDate: block.timestamp,
            status: ProcessingStatus.Completed,
            batchCode: _batchCode,
            distributionBatches: new uint256[](0),
            recordedBy: msg.sender
        });
        
        processingBatchByCode[_batchCode] = processingBatchCount;
        
        // Update harvest to link to this processing
        _addProcessingToHarvest(_harvestBatchId, processingBatchCount);
        
        // Update crop status
        updateCropStatus(cropId, CropStatus.Processed);
        
        emit ProcessingRecorded(processingBatchCount, _harvestBatchId, _batchCode);
        
        return processingBatchCount;
    }
    
    // Internal function to add distribution batch to a processing batch
    function _addDistributionToProcessing(uint256 _processingBatchId, uint256 _distributionBatchId) internal {
        require(processingBatches[_processingBatchId].id != 0, "Processing batch does not exist");
        processingBatches[_processingBatchId].distributionBatches.push(_distributionBatchId);
    }
}