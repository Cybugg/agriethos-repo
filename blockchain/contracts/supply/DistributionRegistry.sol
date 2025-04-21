// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ProcessingRegistry.sol";

/**
 * @title DistributionRegistry
 * @dev Manages distribution records for processed products
 */
contract DistributionRegistry is ProcessingRegistry {
    // Distribution data structure
    struct DistributionBatch {
        uint256 id;
        uint256 processingBatchId;
        string distributor;
        string destination;
        uint256 departureDate;
        uint256 estimatedArrival;
        uint256 actualArrival;
        ShippingStatus status;
        string shipmentId;
        address recordedBy;
    }
    
    // Storage
    mapping(uint256 => DistributionBatch) public distributionBatches;
    mapping(string => uint256) public distributionBatchByCode;
    uint256 public distributionBatchCount;
    
    // Events
    event DistributionRecorded(uint256 indexed distributionId, uint256 indexed processingId, string shipmentId);
    event ShipmentStatusUpdated(uint256 indexed distributionId, ShippingStatus status);
    
    // Functions
    function recordDistribution(
        uint256 _processingBatchId,
        string memory _distributor,
        string memory _destination,
        uint256 _estimatedArrival,
        string memory _shipmentId
    ) public returns (uint256) {
        require(processingBatches[_processingBatchId].id != 0, "Processing batch does not exist");
        require(distributionBatchByCode[_shipmentId] == 0, "Shipment ID already exists");
        
        uint256 harvestBatchId = processingBatches[_processingBatchId].harvestBatchId;
        uint256 cropId = harvestBatches[harvestBatchId].cropId;
        
        require(
            admins[msg.sender] || 
            verifiers[msg.sender], 
            "Only admin or verifier can record distribution"
        );
        
        distributionBatchCount++;
        
        distributionBatches[distributionBatchCount] = DistributionBatch({
            id: distributionBatchCount,
            processingBatchId: _processingBatchId,
            distributor: _distributor,
            destination: _destination,
            departureDate: block.timestamp,
            estimatedArrival: _estimatedArrival,
            actualArrival: 0, // Not arrived yet
            status: ShippingStatus.InTransit,
            shipmentId: _shipmentId,
            recordedBy: msg.sender
        });
        
        distributionBatchByCode[_shipmentId] = distributionBatchCount;
        
        // Link to processing batch
        _addDistributionToProcessing(_processingBatchId, distributionBatchCount);
        
        // Update crop status
        updateCropStatus(cropId, CropStatus.Distributed);
        
        emit DistributionRecorded(distributionBatchCount, _processingBatchId, _shipmentId);
        
        return distributionBatchCount;
    }
    
    function updateShipmentStatus(
        uint256 _distributionBatchId,
        ShippingStatus _status,
        uint256 _actualArrival
    ) public {
        require(distributionBatches[_distributionBatchId].id != 0, "Distribution batch does not exist");
        require(
            admins[msg.sender] || 
            verifiers[msg.sender] || 
            msg.sender == distributionBatches[_distributionBatchId].recordedBy,
            "Not authorized to update shipment"
        );
        
        distributionBatches[_distributionBatchId].status = _status;
        
        if (_status == ShippingStatus.Delivered) {
            distributionBatches[_distributionBatchId].actualArrival = _actualArrival > 0 ? _actualArrival : block.timestamp;
        }
        
        emit ShipmentStatusUpdated(_distributionBatchId, _status);
    }
}