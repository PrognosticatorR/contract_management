import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_DAY_IN_SECS =  24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_DAY_IN_SECS;
  const Lock = await ethers.getContractFactory("Vault");
  const lock = await Lock.deploy(unlockTime);
  (await lock.deployed()).deployTransaction
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
