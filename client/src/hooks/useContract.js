import { useState, useCallback, useMemo, useEffect } from 'react'
import { Contract } from 'ethers'

function useContract(contractArtifact, contractAddress, signer) {
  const [contractInstance, setContractInstance] = useState(null)
  const [error, setError] = useState(null)
  const contractAbi = useMemo(() => contractArtifact.abi, [contractArtifact])
  const getContractInstance = useCallback(() => {
    try {
      const instance = new Contract(contractAddress, contractAbi, signer)
      return instance
    } catch (error) {
      setError(error)
    }
  }, [contractAbi, contractAddress, signer])

  useEffect(() => {
    const instance = getContractInstance()
    setContractInstance(instance)
  }, [getContractInstance])

  return {
    contractInstance,
    error,
  }
}

export default useContract
