import { useEffect, useMemo, useState, useCallback } from 'react'
import { formatEther } from 'ethers'

export const useFetchVault = (contractInstance, defaultAccount) => {
  const [fetchingData, setFetchingData] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [usersDeposite, setUsersDeposite] = useState(0)
  const [unlockTime, setunlockTime] = useState(0)
  const [contractOwner, setContractOwner] = useState('')
  const [canWithdrawEarly, setCanWithdrawEarly] = useState(false)

  const fetchData = useCallback(async () => {
    setFetchingData(true)
    return Promise.allSettled([
      await contractInstance.getTotalValueLocked(),
      await contractInstance.getShare(defaultAccount),
      await contractInstance.unlockTime(),
      await contractInstance.owner(),
      await contractInstance.canWithdrawEarly(),
    ])
  }, [contractInstance, defaultAccount])

  useEffect(() => {
    fetchData()
      .then((data) => {
        const [value, myShare, unlockTime, contractOwner, canWithdrawEarly] = data
        const date = new Date(unlockTime.value.toString() * 1000).toDateString()
        setTotalValue(formatEther(value.value))
        setUsersDeposite(formatEther(myShare.value))
        setunlockTime(date)
        setContractOwner(contractOwner.value)
        setCanWithdrawEarly(canWithdrawEarly.value)
      })
      .then(() => setFetchingData(false))
  }, [fetchData])

  return useMemo(() => {
    return {
      unlockTime,
      usersDeposite,
      totalValue,
      contractOwner,
      fetchingData,
      canWithdrawEarly,
    }
  }, [unlockTime, usersDeposite, totalValue, contractOwner, fetchingData, canWithdrawEarly])
}
