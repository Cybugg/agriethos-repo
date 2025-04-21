// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title AgriEthosAccess
 * @dev Base contract for access control in the AgriEthos system
 */
contract AgriEthosAccess {
    // Chain of command
    address public owner;
    mapping(address => bool) public admins;
    mapping(address => bool) public verifiers;
    
    // Status enum for shipping
    enum ShippingStatus {
        Pending,
        InTransit,
        Delivered,
        Rejected
    }
    
    // Status enum for processing
    enum ProcessingStatus {
        Pending,
        InProgress,
        Completed,
        Failed
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can perform this action");
        _;
    }
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifier can perform this action");
        _;
    }
    
    modifier onlyAdminOrOwner() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin or owner can perform this action");
        _;
    }
    
    modifier onlyVerifierOrAdmin() {
        require(verifiers[msg.sender] || admins[msg.sender] || msg.sender == owner, "Only verifier, admin, or owner can perform this action");
        _;
    }
    
    // Admin management functions
    function setAdmin(address _admin, bool _status) public onlyAdminOrOwner {
        admins[_admin] = _status;
    }
    
    function setVerifier(address _verifier, bool _status) public onlyAdminOrOwner {
        verifiers[_verifier] = _status;
    }
    
    // Ownership transfer
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}