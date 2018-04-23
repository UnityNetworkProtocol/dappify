const MeetupEvent = artifacts.require('./MeetupEvent.sol');
const PunchTheClock = artifacts.require('./PunchTheClock.sol');

const deploy = true

module.exports = !deploy ? null : (deployer) => {
  deployer.deploy(PunchTheClock);
};
