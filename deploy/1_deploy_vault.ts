const deployment = async (hre: {
  network?: any;
  deployments?: any;
  getNamedAccounts?: any;
}) => {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_DAY_IN_SECS = 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_DAY_IN_SECS;
  if (!hre.network.name.includes("mainnet")) {
    return deploy("Vault", {
      from: deployer,
      args: [unlockTime],
      log: true,
    });
  }
};

deployment.tags = ["Vault", "ETH"];
module.exports = deployment;
