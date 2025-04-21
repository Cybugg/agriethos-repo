// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./supply/RetailRegistry.sol";

/**
 * @title AgriEthosTraceability
 * @dev Main contract for the AgriEthos platform that integrates all components
 */
contract AgriEthosTraceability is RetailRegistry {
    // Contract version for upgrade tracking
    string public constant VERSION = "1.0.0";
    
    // Initialization status
    bool private initialized;
    
    // Contract constructor
    constructor() {
        // The RetailRegistry constructor chain will be called automatically
    }
    
    // Events for traceability queries
    event TraceabilityQueried(address indexed querier, string qrCode, uint256 timestamp);
    event MobileAppScan(address indexed user, string qrCode, uint256 timestamp);
    
    // Initialize function to be called after deployment
    function initialize() public {
        require(!initialized, "Contract already initialized");
        initialized = true;
        
        // Set the caller as the owner and admin
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    /**
     * @dev Generated QR code for a crop
     * @param _cropId ID of the crop
     * @return qrCode The QR code string
     */
    function generateCropQR(uint256 _cropId) public view cropExists(_cropId) returns (string memory qrCode) {
        (string memory name,,,,,) = getCropDetails(_cropId);
        return string(abi.encodePacked(
            "AGRI-CROP-",
            _uint2str(_cropId),
            "-",
            name,
            "-",
            _uint2str(block.timestamp)
        ));
    }
    
    /**
     * @dev Generated QR code for a harvest batch
     * @param _harvestId ID of the harvest batch
     * @return qrCode The QR code string
     */
    function generateHarvestQR(uint256 _harvestId) public view returns (string memory qrCode) {
        require(harvestBatches[_harvestId].id != 0, "Harvest does not exist");
        return string(abi.encodePacked(
            "AGRI-HARVEST-",
            _uint2str(_harvestId),
            "-",
            _uint2str(harvestBatches[_harvestId].cropId),
            "-",
            _uint2str(block.timestamp)
        ));
    }
    
    /**
     * @dev Query comprehensive traceability data for a product using QR code
     * @param _qrCode QR code of the product
     * @return entityType Type of entity (CROP, HARVEST, etc.)
     * @return entityId ID of the entity
     * @return productName Name of the product
     * @return farmId ID of the farm
     * @return farmName Name of the farm
     * @return farmerId ID of the farmer
     * @return farmerName Name of the farmer
     * @return productStatus Status of the product
     * @return hasCertifications Whether the product has certifications
     */
    function queryTraceability(string memory _qrCode) public returns (
        string memory entityType,
        uint256 entityId,
        string memory productName,
        uint256 farmId,
        string memory farmName,
        uint256 farmerId,
        string memory farmerName,
        string memory productStatus,
        bool hasCertifications
    ) {
        // Extract entity type and ID from QR code
        string memory qrPrefix = "";
        uint256 id = 0;
        
        // Simplified QR parsing for the example
        if (bytes(_qrCode).length > 10) {
            if (_containsString(_qrCode, "AGRI-CROP-")) {
                qrPrefix = "CROP";
                // Parse ID (this is simplified - actual parsing would be more robust)
                id = _parseIdFromQR(_qrCode);
            } else if (_containsString(_qrCode, "AGRI-HARVEST-")) {
                qrPrefix = "HARVEST";
                id = _parseIdFromQR(_qrCode);
            } else if (_containsString(_qrCode, "AGRI-PROCESSING-")) {
                qrPrefix = "PROCESSING";
                id = _parseIdFromQR(_qrCode);
            } else if (_containsString(_qrCode, "AGRI-RETAIL-")) {
                qrPrefix = "RETAIL";
                id = _parseIdFromQR(_qrCode);
            }
        }
        
        // Record the query event
        emit TraceabilityQueried(msg.sender, _qrCode, block.timestamp);
        
        // Process based on entity type
        if (keccak256(abi.encodePacked(qrPrefix)) == keccak256(abi.encodePacked("CROP"))) {
            require(cropToFarm[id] != 0, "Crop not found");
            
            (string memory name, string memory variety,,,, uint256 fId) = getCropDetails(id);
            (string memory fName,,,,) = getFarmDetails(fId);
            uint256 fmId = farmToFarmer[fId];
            
            return (
                "CROP",
                id,
                string(abi.encodePacked(name, " (", variety, ")")),
                fId,
                fName,
                fmId,
                farmers[fmId].name,
                "Growing", // Simplified - would check actual status
                hasValidCertification(id, CertificationType.Organic, false) // Check if organic certified
            );
        }
        else if (keccak256(abi.encodePacked(qrPrefix)) == keccak256(abi.encodePacked("HARVEST"))) {
            // Similar implementation for harvest batches
            // This would extract harvest data and follow the chain back to the crop and farm
        }
        
        // Default return if QR code not recognized
        return ("UNKNOWN", 0, "", 0, "", 0, "", "", false);
    }
    
    /**
     * @dev Record a mobile app scan of a product
     * @param _qrCode QR code that was scanned
     * @param _latitude Latitude of scan location
     * @param _longitude Longitude of scan location
     */
    function recordMobileScan(
        string memory _qrCode,
        string memory _latitude,
        string memory _longitude
    ) public {
        // Store scan info in appropriate data structures
        // This could be expanded to use the AgriEthosStorage contract
        
        emit MobileAppScan(msg.sender, _qrCode, block.timestamp);
    }
    
    /**
     * @dev Check if a product is authentic based on its QR code
     * @param _qrCode QR code to verify
     * @return bool True if product is authentic (exists on blockchain)
     */
    function verifyAuthenticProduct(string memory _qrCode) public view returns (bool) {
        // Extract entity type and ID from QR code
        string memory qrPrefix = "";
        uint256 id = 0;
        
        // Simplified QR parsing
        if (bytes(_qrCode).length > 10) {
            if (_containsString(_qrCode, "AGRI-CROP-")) {
                qrPrefix = "CROP";
                id = _parseIdFromQR(_qrCode);
                return cropToFarm[id] != 0;
            } else if (_containsString(_qrCode, "AGRI-HARVEST-")) {
                qrPrefix = "HARVEST";
                id = _parseIdFromQR(_qrCode);
                return harvestBatches[id].id != 0;
            } else if (_containsString(_qrCode, "AGRI-PROCESSING-")) {
                qrPrefix = "PROCESSING";
                id = _parseIdFromQR(_qrCode);
                return processingBatches[id].id != 0;
            } else if (_containsString(_qrCode, "AGRI-RETAIL-")) {
                qrPrefix = "RETAIL";
                id = _parseIdFromQR(_qrCode);
                return retailRecords[id].id != 0;
            }
        }
        
        return false;
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    function _containsString(string memory _source, string memory _search) private pure returns (bool) {
        bytes memory sourceBytes = bytes(_source);
        bytes memory searchBytes = bytes(_search);
        
        if (searchBytes.length > sourceBytes.length) {
            return false;
        }
        
        for (uint i = 0; i <= sourceBytes.length - searchBytes.length; i++) {
            bool found = true;
            
            for (uint j = 0; j < searchBytes.length; j++) {
                if (sourceBytes[i + j] != searchBytes[j]) {
                    found = false;
                    break;
                }
            }
            
            if (found) {
                return true;
            }
        }
        
        return false;
    }
    
    function _parseIdFromQR(string memory _qrCode) private pure returns (uint256) {
        // This is a simplified implementation - actual parsing would be more robust
        // For example, extract the number between the first and second dash after prefix
        
        bytes memory qrBytes = bytes(_qrCode);
        uint256 dashCount = 0;
        uint256 startPos = 0;
        uint256 endPos = 0;
        
        for (uint i = 0; i < qrBytes.length; i++) {
            if (qrBytes[i] == '-') {
                dashCount++;
                if (dashCount == 2) {
                    startPos = i + 1;
                } else if (dashCount == 3) {
                    endPos = i;
                    break;
                }
            }
        }
        
        if (startPos == 0 || endPos == 0 || startPos >= endPos) {
            return 0;
        }
        
        uint256 result = 0;
        for (uint i = startPos; i < endPos; i++) {
            if (uint8(qrBytes[i]) >= 48 && uint8(qrBytes[i]) <= 57) {
                result = result * 10 + (uint8(qrBytes[i]) - 48);
            }
        }
        
        return result;
    }
}