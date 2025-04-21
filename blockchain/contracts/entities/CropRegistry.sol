// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./FarmRegistry.sol";

/**
 * @title CropRegistry
 * @dev Manages crop registration and information
 */
contract CropRegistry is FarmRegistry {
    // Crop status enum
    enum CropStatus {
        Growing,
        Harvested,
        Processed,
        Distributed,
        Sold
    }
    
    // Crop data structure
    struct Crop {
        uint256 id;
        string name;
        string variety;
        string seedSource;
        uint256 plantingDate;
        uint256 estimatedHarvest;
        CropStatus status;
        uint256 areaSize; // in square meters
        string gpsCoordinates;
        mapping(string => string) details; // Flexible key-value storage for additional info
    }
    
    // Storage
    mapping(uint256 => Crop) private crops;
    mapping(uint256 => uint256) public cropToFarm; // cropId => farmId
    uint256 public cropCount;
    
    // Events
    event CropRegistered(uint256 indexed cropId, uint256 indexed farmId, string name, string variety);
    event CropStatusUpdated(uint256 indexed cropId, CropStatus oldStatus, CropStatus newStatus);
    
    // Modifiers
    modifier cropExists(uint256 _cropId) {
        require(cropToFarm[_cropId] != 0, "Crop does not exist");
        _;
    }
    
    modifier onlyCropOwner(uint256 _cropId) {
        uint256 farmId = cropToFarm[_cropId];
        require(farmId != 0, "Crop does not exist");
        
        uint256 farmerId = farmToFarmer[farmId];
        require(
            farmerByAddress[msg.sender] == farmerId || 
            admins[msg.sender] ||
            owner == msg.sender,
            "Not authorized for this crop"
        );
        _;
    }
    
    // Registration function
    function registerCrop(
        uint256 _farmId,
        string memory _name,
        string memory _variety,
        string memory _seedSource
    ) public farmExists(_farmId) returns (uint256) {
        uint256 farmerId = farmToFarmer[_farmId];
        
        // Either the farmer who owns the farm or an admin can register a crop
        require(
            farmerByAddress[msg.sender] == farmerId || 
            admins[msg.sender] || 
            owner == msg.sender,
            "Not authorized to register crops for this farm"
        );
        
        cropCount++;
        
        Crop storage newCrop = crops[cropCount];
        newCrop.id = cropCount;
        newCrop.name = _name;
        newCrop.variety = _variety;
        newCrop.seedSource = _seedSource;
        newCrop.plantingDate = block.timestamp;
        newCrop.status = CropStatus.Growing;
        
        cropToFarm[cropCount] = _farmId;
        
        emit CropRegistered(cropCount, _farmId, _name, _variety);
        
        return cropCount;
    }
    
    // Update crop estimated harvest date
    function setEstimatedHarvest(
        uint256 _cropId,
        uint256 _estimatedHarvest
    ) public onlyCropOwner(_cropId) {
        require(_estimatedHarvest > block.timestamp, "Estimated harvest must be in the future");
        crops[_cropId].estimatedHarvest = _estimatedHarvest;
    }
    
    // Update crop status
    function updateCropStatus(
        uint256 _cropId,
        CropStatus _newStatus
    ) public cropExists(_cropId) {
        require(
            admins[msg.sender] || 
            owner == msg.sender || 
            farmerByAddress[msg.sender] == farmToFarmer[cropToFarm[_cropId]],
            "Not authorized to update crop status"
        );
        
        CropStatus oldStatus = crops[_cropId].status;
        crops[_cropId].status = _newStatus;
        
        emit CropStatusUpdated(_cropId, oldStatus, _newStatus);
    }
    
    // Set additional crop detail (key-value pair)
    function _setCropDetail(
        uint256 _cropId,
        string memory _key,
        string memory _value
    ) internal cropExists(_cropId) {
        crops[_cropId].details[_key] = _value;
    }
    
    // Public interface to set crop detail
    function setCropDetail(
        uint256 _cropId,
        string memory _key,
        string memory _value
    ) public onlyCropOwner(_cropId) {
        _setCropDetail(_cropId, _key, _value);
    }
    
    // Set crop GPS coordinates
    function setCropGPS(
        uint256 _cropId,
        string memory _gpsCoordinates
    ) public onlyCropOwner(_cropId) {
        crops[_cropId].gpsCoordinates = _gpsCoordinates;
    }
    
    // Set crop area size
    function setCropAreaSize(
        uint256 _cropId,
        uint256 _areaSize
    ) public onlyCropOwner(_cropId) {
        crops[_cropId].areaSize = _areaSize;
    }
    
    // Get crop details
    function getCropDetails(uint256 _cropId) public view cropExists(_cropId) returns (
        string memory name,
        string memory variety,
        string memory seedSource,
        uint256 plantingDate,
        CropStatus status,
        uint256 farmId
    ) {
        Crop storage crop = crops[_cropId];
        return (
            crop.name,
            crop.variety,
            crop.seedSource,
            crop.plantingDate,
            crop.status,
            cropToFarm[_cropId]
        );
    }
    
    // Get crop GPS coordinates
    function getCropGPS(uint256 _cropId) public view cropExists(_cropId) returns (string memory) {
        return crops[_cropId].gpsCoordinates;
    }
    
    // Get crop area size
    function getCropAreaSize(uint256 _cropId) public view cropExists(_cropId) returns (uint256) {
        return crops[_cropId].areaSize;
    }
    
    // Get crop detail (key-value)
    function getCropDetail(
        uint256 _cropId,
        string memory _key
    ) public view cropExists(_cropId) returns (string memory) {
        return crops[_cropId].details[_key];
    }
}