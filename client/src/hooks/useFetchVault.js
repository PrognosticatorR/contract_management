import  { useEffect, useMemo, useState, useCallback } from 'react'
import { formatEther } from 'ethers'

export const useFetchVault = (contractInstance, defaultAccount) => {
  const [totalValue, setTotalValue] = useState(0)
  const [usersDeposite, setUsersDeposite] = useState(0)
  const [unlockTime, setunlockTime] = useState(0)

  const fetchData = useCallback(async () => {
    return Promise.all([await contractInstance.getTotalValueLocked(), await contractInstance.getShare(defaultAccount), await contractInstance.unlockTime()])
  }, [contractInstance, defaultAccount])

  useEffect(() => {
    fetchData().then((data) => {
      const [value, myShare, unlockTime] = data
      const date = new Date(unlockTime.toString(10) * 1000).toDateString()
      setTotalValue(formatEther(value))
      setUsersDeposite(formatEther(myShare))
      setunlockTime(date)
    })
  }, [fetchData, usersDeposite, totalValue, defaultAccount])

  return useMemo(() => {
    return [
      unlockTime,
      usersDeposite,
      totalValue,
    ]
  }, [unlockTime, usersDeposite, totalValue])
}
