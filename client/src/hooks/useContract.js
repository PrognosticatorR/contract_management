import { useState, useCallback, useMemo, useEffect } from 'react'
import { Contract } from 'ethers'

function useContract(contractArtifact, contractAddress) {
  const [contractInstance, setContractInstance] = useState(null)
  const [error, setError] = useState(null)
  const contractAbi = useMemo(() => contractArtifact.abi, [contractArtifact])
  const getContractInstance = useCallback(() => {
    try {
      return new Contract(contractAddress, contractAbi)
    } catch (error) {
      setError(error)
    }
  }, [contractArtifact])

  useEffect(() => {
    const instance = getContractInstance()
    setContractInstance(instance)
  }, [])

  return {
    contractInstance,
    error,
  }
}

export default useContract
