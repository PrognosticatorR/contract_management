import { useEffect, useMemo, useState, useCallback } from 'react'
import { formatEther } from 'ethers'

export const useFetchVault = (contractInstance, defaultAccount) => {
  const [fetchingData, setFetchingData] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [usersDeposite, setUsersDeposite] = useState(0)
  const [unlockTime, setunlockTime] = useState(0)
  const [contractOwner, setContractOwner] = useState('')

  const fetchData = useCallback(async () => {
    setFetchingData(true)
    return Promise.allSettled([
      await contractInstance.getTotalValueLocked(),
      await contractInstance.getShare(defaultAccount),
      await contractInstance.unlockTime(),
      await contractInstance.owner(),
    ])
  }, [contractInstance, defaultAccount])

  useEffect(() => {
    fetchData()
      .then((data) => {
        const [value, myShare, unlockTime, contractOwner] = data
        const date = new Date(unlockTime.value.toString() * 1000).toDateString()
        setTotalValue(formatEther(value.value))
        setUsersDeposite(formatEther(myShare.value))
        setunlockTime(date)
        setContractOwner(contractOwner.value)
      })
      .then(() => setFetchingData(false))
  }, [])

  return useMemo(() => {
    return {
      unlockTime,
      usersDeposite,
      totalValue,
      contractOwner,
      fetchingData
    }
  }, [unlockTime, usersDeposite, totalValue, contractOwner,fetchingData])
}
