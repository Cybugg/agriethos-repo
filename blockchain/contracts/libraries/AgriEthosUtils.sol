// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title AgriEthosUtils
 * @dev Utility functions for AgriEthos contracts
 */
library AgriEthosUtils {
    /**
     * @dev Generates a unique ID by combining components and applying a hash function
     * @param _prefix String prefix for the ID
     * @param _timestamp Current timestamp
     * @param _address Address associated with the operation
     * @param _nonce A nonce to ensure uniqueness
     * @return bytes32 A unique identifier
     */
    function generateUniqueId(
        string memory _prefix,
        uint256 _timestamp,
        address _address,
        uint256 _nonce
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_prefix, _timestamp, _address, _nonce));
    }

    /**
     * @dev Validates a QR code format
     * @param _qrCode The QR code string to validate
     * @return bool True if the QR code is valid, false otherwise
     */
    function validateQRCode(string memory _qrCode) internal pure returns (bool) {
        bytes memory qrBytes = bytes(_qrCode);
        // Require QR code to be at least 8 characters long
        if (qrBytes.length < 8) return false;
        
        // Require QR code to start with "AGRI-"
        return (
            qrBytes[0] == "A" &&
            qrBytes[1] == "G" &&
            qrBytes[2] == "R" &&
            qrBytes[3] == "I" &&
            qrBytes[4] == "-"
        );
    }
    
    /**
     * @dev Extracts the entity type from a QR code
     * @param _qrCode The QR code to parse
     * @return string The entity type (CROP, FARM, HARVEST, etc.)
     */
    function extractEntityType(string memory _qrCode) internal pure returns (string memory) {
        bytes memory qrBytes = bytes(_qrCode);
        uint256 dashCount = 0;
        uint256 startIdx = 0;
        uint256 endIdx = 0;
        
        for (uint256 i = 0; i < qrBytes.length; i++) {
            if (qrBytes[i] == "-") {
                dashCount++;
                if (dashCount == 1) {
                    startIdx = i + 1;
                } else if (dashCount == 2) {
                    endIdx = i;
                    break;
                }
            }
        }
        
        if (endIdx <= startIdx) return "";
        
        bytes memory result = new bytes(endIdx - startIdx);
        for (uint256 i = 0; i < endIdx - startIdx; i++) {
            result[i] = qrBytes[startIdx + i];
        }
        
        return string(result);
    }
    
    /**
     * @dev Generates a QR code string for a specific entity
     * @param _entityType Type of entity (CROP, FARM, HARVEST, etc.)
     * @param _id ID of the entity
     * @param _timestamp Timestamp of creation
     * @return string QR code string
     */
    function generateQRCode(
        string memory _entityType,
        uint256 _id,
        uint256 _timestamp
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(
            "AGRI-",
            _entityType,
            "-",
            uint2str(_id),
            "-",
            uint2str(_timestamp)
        ));
    }
    
    /**
     * @dev Converts a uint to a string
     * @param _i The uint to convert
     * @return result The string representation
     */
    function uint2str(uint256 _i) internal pure returns (string memory result) {
        if (_i == 0) {
            return "0";
        }
        
        uint256 j = _i;
        uint256 length;
        
        // Calculate length of the string
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        // Create bytes array
        bytes memory bstr = new bytes(length);
        j = length;
        
        // Fill the bytes array
        while (_i != 0) {
            j = j - 1;
            bstr[j] = bytes1(uint8(48 + uint8(_i % 10)));
            _i /= 10;
        }
        
        return string(bstr);
    }
}