// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

contract Vault {
    uint public unlockTime;
    address payable public owner;
    mapping(address => uint) public shareOf;
    event Withdrawal(uint amount, uint when);
    event Deposite(uint amount, address investor);
    bool public canWithdrawEarly;

    constructor(uint _unlockTime) payable {
        require(block.timestamp <= _unlockTime, 'Unlock time should be in the future');
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner can do this');
        _;
    }

    function withdraw() external payable {
        require(block.timestamp >= unlockTime || canWithdrawEarly, "You can't withdraw yet");
        uint balanceOfuser = shareOf[msg.sender];
        require(balanceOfuser > 0, 'Cant withdraw zero balace!');
        shareOf[msg.sender] = 0;
        payable(msg.sender).transfer(balanceOfuser);
        emit Withdrawal(balanceOfuser, block.timestamp);
    }

    function getShare(address investor) external view returns (uint) {
        return shareOf[investor];
    }

    function getTotalValueLocked() external view returns (uint) {
        return address(this).balance;
    }

    function closeVault() external payable onlyOwner {
        require(!canWithdrawEarly, 'Already approved to withraw funds!');
        canWithdrawEarly = true;
    }

    receive() external payable {
        require(msg.value > 0, 'deposite must be larger then zero');
        shareOf[msg.sender] += msg.value;
        emit Deposite(msg.value, msg.sender);
    }
}
