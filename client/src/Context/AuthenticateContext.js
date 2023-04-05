import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { formatEther, BrowserProvider } from 'ethers'

const AuthenticatedContext = createContext(null)

export const useAuthenticated = () => {
  const context = useContext(AuthenticatedContext)
  if (!context) {
    throw new Error(`useAuthenticated must be used within a AuthenticatedProvider`)
  }
  return context
}

export const AuthenticateProvider = (props) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [userBalance, setUserBalance] = useState(null)
  const [ConnButtonText, setConnButtonText] = useState('Connect Wallet!')
  const [provider, setProvider] = useState(null)
  const getAccountBalance = useCallback((account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setUserBalance(parseFloat(formatEther(balance)).toFixed(4))
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
  }, [])

  const accountChangedHandler = useCallback(
    (newAccount) => {
      let account = newAccount
      if (newAccount instanceof Array) {
        account = newAccount[0]
      }
      setDefaultAccount(account)
      getAccountBalance(account)
    },
    [getAccountBalance]
  )

  const connectWalletHandler = useCallback(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')
      const provider = new BrowserProvider(window.ethereum)
      setProvider(provider)
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          console.log(result)
          accountChangedHandler(result[0])
          setConnButtonText('Wallet Connected')
          getAccountBalance(result[0])
        })
        .catch((error) => {
          setErrorMessage(error.message)
        })
    } else {
      console.log('Need to install MetaMask')
      setErrorMessage('Please install MetaMask browser extension to interact')
    }
  }, [accountChangedHandler, getAccountBalance])

  const chainChangedHandler = useCallback(() => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload()
  }, [])

  const values = useMemo(() => {
    const isAuthenticated = defaultAccount && !!userBalance
    return {
      isAuthenticated,
      errorMessage,
      defaultAccount,
      chainChangedHandler,
      accountChangedHandler,
      connectWalletHandler,
      ConnButtonText,
      userBalance,
      provider,
    }
  }, [errorMessage, chainChangedHandler, connectWalletHandler, defaultAccount, userBalance, ConnButtonText, accountChangedHandler, provider])

  return <AuthenticatedContext.Provider value={values} {...props} />
}
