// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "contracts/entities/CropRegistry.sol";

/**
 * @title CertificationRegistry
 * @dev Manages certifications for agricultural products and entities
 */
contract CertificationRegistry is CropRegistry {
    // Certification types
    enum CertificationType {
        Organic,
        FairTrade,
        Sustainable,
        RainforestAlliance,
        UTZ,
        NonGMO,
        CarbonNeutral,
        LocallySourced,
        PesticideFree
    }
    
    // Certification status
    enum CertificationStatus {
        Active,
        Expired,
        Revoked
    }
    
    // Certification structure
    struct Certification {
        uint256 id;
        CertificationType certType;
        string certificationId; // Issued by certification body
        string issuer; // Certification body
        uint256 issuedDate;
        uint256 expiryDate;
        string documentCID; // IPFS CID for certificate document
        CertificationStatus status;
        address issuedBy; // Address that recorded this certification
    }
    
    // Entity certification structure
    struct EntityCertification {
        uint256 certificationId;
        uint256 entityId; // Farmer, Farm, or Crop ID
        uint8 entityType; // 0 = Farmer, 1 = Farm, 2 = Crop
    }
    
    // Storage
    mapping(uint256 => Certification) public certifications;
    uint256 public certificationCount;
    
    // Entity to certification mappings
    mapping(uint256 => uint256[]) public farmerCertifications; // farmerId => certification IDs
    mapping(uint256 => uint256[]) public farmCertifications;   // farmId => certification IDs
    mapping(uint256 => uint256[]) public cropCertifications;   // cropId => certification IDs
    
    // Certifier registry
    mapping(address => bool) public certifiers;
    
    // Events
    event CertificationCreated(uint256 indexed certificationId, CertificationType indexed certType, string issuer);
    event CertificationAssigned(uint256 indexed certificationId, uint256 indexed entityId, uint8 entityType);
    event CertificationStatusUpdated(uint256 indexed certificationId, CertificationStatus status);
    
    // Modifiers
    modifier onlyCertifierOrAdmin() {
        require(
            certifiers[msg.sender] || 
            admins[msg.sender] || 
            owner == msg.sender,
            "Not authorized to manage certifications"
        );
        _;
    }
    
    // Management functions
    function setCertifier(address _certifier, bool _status) public onlyAdminOrOwner {
        certifiers[_certifier] = _status;
    }
    
    // Certification registration
    function registerCertification(
        CertificationType _certType,
        string memory _certificationId,
        string memory _issuer,
        uint256 _expiryDate,
        string memory _documentCID
    ) public onlyCertifierOrAdmin returns (uint256) {
        require(_expiryDate > block.timestamp, "Expiry date must be in the future");
        
        certificationCount++;
        
        certifications[certificationCount] = Certification({
            id: certificationCount,
            certType: _certType,
            certificationId: _certificationId,
            issuer: _issuer,
            issuedDate: block.timestamp,
            expiryDate: _expiryDate,
            documentCID: _documentCID,
            status: CertificationStatus.Active,
            issuedBy: msg.sender
        });
        
        emit CertificationCreated(certificationCount, _certType, _issuer);
        
        return certificationCount;
    }
    
    // Assign certification to a farmer
    function assignFarmerCertification(
        uint256 _farmerId,
        uint256 _certificationId
    ) public onlyCertifierOrAdmin farmerExists(_farmerId) {
        require(certifications[_certificationId].id != 0, "Certification does not exist");
        require(certifications[_certificationId].status == CertificationStatus.Active, "Certification is not active");
        
        farmerCertifications[_farmerId].push(_certificationId);
        
        emit CertificationAssigned(_certificationId, _farmerId, 0);
    }
    
    // Assign certification to a farm
    function assignFarmCertification(
        uint256 _farmId,
        uint256 _certificationId
    ) public onlyCertifierOrAdmin farmExists(_farmId) {
        require(certifications[_certificationId].id != 0, "Certification does not exist");
        require(certifications[_certificationId].status == CertificationStatus.Active, "Certification is not active");
        
        farmCertifications[_farmId].push(_certificationId);
        
        emit CertificationAssigned(_certificationId, _farmId, 1);
    }
    
    // Assign certification to a crop
    function assignCropCertification(
        uint256 _cropId,
        uint256 _certificationId
    ) public onlyCertifierOrAdmin cropExists(_cropId) {
        require(certifications[_certificationId].id != 0, "Certification does not exist");
        require(certifications[_certificationId].status == CertificationStatus.Active, "Certification is not active");
        
        cropCertifications[_cropId].push(_certificationId);
        
        emit CertificationAssigned(_certificationId, _cropId, 2);
    }
    
    // Update certification status
    function updateCertificationStatus(
        uint256 _certificationId,
        CertificationStatus _status
    ) public onlyCertifierOrAdmin {
        require(certifications[_certificationId].id != 0, "Certification does not exist");
        
        certifications[_certificationId].status = _status;
        
        emit CertificationStatusUpdated(_certificationId, _status);
    }
    
    // Check if entity has a valid certification of specific type
    function hasValidCertification(
        uint256 _entityId,
        CertificationType _certType,
        bool _isFarmer
    ) public view returns (bool) {
        uint256[] memory entityCerts;
        
        if (_isFarmer) {
            entityCerts = farmerCertifications[_entityId];
        } else {
            entityCerts = cropCertifications[_entityId];
        }
        
        for (uint256 i = 0; i < entityCerts.length; i++) {
            uint256 certId = entityCerts[i];
            Certification memory cert = certifications[certId];
            
            if (cert.certType == _certType && 
                cert.status == CertificationStatus.Active && 
                cert.expiryDate > block.timestamp) {
                return true;
            }
        }
        
        return false;
    }
    
    // Get all certifications for a farmer
    function getFarmerCertifications(uint256 _farmerId) public view returns (uint256[] memory) {
        return farmerCertifications[_farmerId];
    }
    
    // Get all certifications for a farm
    function getFarmCertifications(uint256 _farmId) public view returns (uint256[] memory) {
        return farmCertifications[_farmId];
    }
    
    // Get all certifications for a crop
    function getCropCertifications(uint256 _cropId) public view returns (uint256[] memory) {
        return cropCertifications[_cropId];
    }
    
    // Get certification details
    function getCertificationDetails(uint256 _certificationId) public view returns (
        string memory certificationId,
        string memory issuer,
        uint256 issuedDate,
        uint256 expiryDate,
        CertificationStatus status,
        string memory documentCID
    ) {
        Certification memory cert = certifications[_certificationId];
        require(cert.id != 0, "Certification does not exist");
        
        return (
            cert.certificationId,
            cert.issuer,
            cert.issuedDate,
            cert.expiryDate,
            cert.status,
            cert.documentCID
        );
    }
    
    // Helper function to convert uint to string
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        
        uint256 j = _i;
        uint256 length;
        
        while (j != 0) {
            length++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(length);
        j = length;
        
        while (_i != 0) {
            j = j - 1;
            bstr[j] = bytes1(uint8(48 + uint8(_i % 10)));
            _i /= 10;
        }
        
        return string(bstr);
    }
}