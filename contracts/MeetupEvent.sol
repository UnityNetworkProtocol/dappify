pragma solidity ^0.4.0;

contract MeetupEvent {

    address public creator;
    address public owner;
    uint public eventCap;
    uint public costOfEvent;
    uint public dateOfEvent;
    struct rsvpSingle {
        uint balance;
        string name;
        bool isRsvped;
    }
    mapping (address => rsvpSingle) public rsvpData;
    
    address[] public rsvpList;

    event EventRsvp(    
        address indexed _from,
        string _name
        );

    event EventOwnerWithdrawal(
        address indexed _from,
        uint _value
        );

    event Error(address indexed _sender, bytes32 error);

    modifier mustHaveSpace() {
        if(eventCap != 0) require(rsvpList.length < eventCap);
        _;
    }

    modifier isEnded() {
        // require(now >= dateOfEvent + 3 hours);
        require(now >= dateOfEvent); // while testing...
        _;
    }

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    function isRsvped(address _address) public view returns(bool isIndeed) {
      return rsvpData[_address].isRsvped;
    }

    function MeetupEvent(uint _priceInWei,
                        address _owner,
                        uint _cap,
                        uint _dateAsUnixTimestamp)
      public {
        require(_dateAsUnixTimestamp > now);
        creator = msg.sender;
        costOfEvent = _priceInWei;
        owner = _owner;
        eventCap = _cap;
        dateOfEvent = _dateAsUnixTimestamp;
    }

    function rsvpMe(string _name) public mustHaveSpace {
        rsvpData[msg.sender].name = _name;
        rsvpData[msg.sender].isRsvped = true;
        rsvpList.push(msg.sender);
        EventRsvp(msg.sender, _name);
    }

    function getAttendeeAddresses() view public returns (address[]) {
        return rsvpList;
    }

    function getAttendeeInfo(address _address) view public returns (uint, string) {
        return (rsvpData[_address].balance, rsvpData[_address].name);
    }

    function ownerWithdrawal() public isEnded isOwner {
        uint _balance = this.balance;
        owner.transfer(_balance);
        EventOwnerWithdrawal(owner, _balance);
    }
}
