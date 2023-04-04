// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Vault {
    uint public unlockTime;
    address payable public owner;
    uint public totalValueLocked;
    mapping(address => uint) public shareOf;
    event Withdrawal(uint amount, uint when);
    event Deposite(uint amount, address investor);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(shareOf[msg.sender] > 0, "Cant withdraw zero balace!");
        emit Withdrawal(address(this).balance, block.timestamp);
        payable(msg.sender).transfer(shareOf[msg.sender]);
    }

    function getShare(address investor) public view returns (uint) {
        return shareOf[investor];
    }

    receive() external payable {
        require(msg.value > 0, "deposite must be larger then zero");
        emit Deposite(msg.value, msg.sender);
    }
}
