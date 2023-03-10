import React, { useCallback, useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import UserConnected from './components/UserConnected'
import UserNotConnected from './components/UserNotConnected'
import { PROVIDERS_DATA } from './utilities/constants'
import { ethDetected, getAccounts, getChainId, onChainChanged } from './utilities/ethereum'
import { getChainIdHumanized, getWalletError } from './utilities/helpers'

type Component = () => JSX.Element

const App: Component = () => {
  const [currentChainId, setCurrentChainId] = useState(PROVIDERS_DATA.GOERLI.chainId)
  const [walletDetected, setWalletDetected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [error, setError] = useState('')

  // Check wallet
  const checkWallet = async () => {
    setError('')

    try {
      // Check if wallet is installed
      if (!ethDetected()) {
        return
      }
      setWalletDetected(true)

      // Check if Chain is Supported
      const supportedChain = PROVIDERS_DATA.GOERLI.chainId
      if (supportedChain !== currentChainId) {
        setError('Chain is not supported. Use G\xF6erli')
        return
      }

      // Check if wallet is connected
      const accounts = await getAccounts()
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      } else {
        setError('No authorized account found.')
      }
    } catch (error) {
      setError('Oops... something went wrong.')
    }
  }

  // Handle Connect wallet click
  const connectWallet = useCallback(async () => {
    setError('')

    try {
      const accounts = await getAccounts()

      setCurrentAccount(accounts[0])
    } catch (error: any) {
      const errMessage = getWalletError(error.code)
      setError(errMessage)
    }
  }, [])

  // Handle chainChanged event
  onChainChanged(setCurrentChainId)

  // On first load set CurrentChainId
  useEffect(() => {
    const getCurrentChain = async () => {
      const chainId = await getChainId()
      const chainIdHumanized = getChainIdHumanized(chainId)
      setCurrentChainId(chainIdHumanized)
    }

    if (!ethDetected()) {
      return
    }

    getCurrentChain()
  }, [])

  // On Account or ChainId change execute validations
  useEffect(() => {
    checkWallet()
  }, [currentAccount, currentChainId])

  return (
    <div className="App">
      <h1 className="fs-1 fw-bold text-center my-4">A liquidity pool</h1>

      {currentAccount.length === 0 ? (
        <div className="user-not-connected d-flex flex-column justify-content-center my-4">
          <UserNotConnected isDisabled={!walletDetected} onConnect={() => connectWallet()} />
        </div>
      ) : (
        <div className="user-connected d-flex flex-column justify-content-center my-4">
          {!error && <UserConnected account={currentAccount} />}
          {!error && <Dashboard account={currentAccount} chainId={currentChainId} />}
        </div>
      )}

      {!walletDetected && <p className="text-center">You need to install Metamask.</p>}
      {error && <p className="text-center">{error}</p>}
    </div>
  )
}

export default App
