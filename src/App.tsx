import React, { useCallback, useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import UserConnected from './components/UserConnected'
import UserNotConnected from './components/UserNotConnected'
import { CHAINS } from './utilities/constants'
import { getChainIdHumanized } from './utilities/helpers'
import { getWalletError } from './utilities/walletErrors'

type Component = () => JSX.Element

const App: Component = () => {
  const [currentChainId, setCurrentChainId] = useState(CHAINS.GOERLI.chainId)
  const [walletDetected, setWalletDetected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [error, setError] = useState('')

  const { ethereum } = window

  // Check wallet
  const checkWallet = async () => {
    setError('')

    try {
      // Check if wallet is installed
      if (!ethereum) {
        return
      }
      setWalletDetected(true)

      // Check if Chain is Supported
      const supportedChain = CHAINS.GOERLI.chainId
      if (supportedChain !== currentChainId) {
        setError('Chain is not supported. Use G\xF6erli')
        return
      }

      // Check if wallet is connected
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      } else {
        setError('No authorized account found.')
      }
    } catch (error) {
      setError('Oops... something went wrong.')
    }
  }

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setError('')

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      setCurrentAccount(accounts[0])
    } catch (error: any) {
      const errMessage = getWalletError(error.code)
      setError(errMessage)
    }
  }, [])

  // Handle chainChanged event
  ethereum?.on('chainChanged', (chainId: any) => {
    const chainIdHumanized = getChainIdHumanized(chainId)
    setCurrentChainId(chainIdHumanized)
  })

  // On first load set CurrentChainId
  useEffect(() => {
    const getCurrentChain = async () => {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      const chainIdHumanized = getChainIdHumanized(chainId)
      setCurrentChainId(chainIdHumanized)
    }

    if (!ethereum) {
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
      <h1 className="text-center">A web3 wallet</h1>

      {currentAccount.length === 0 ? (
        <div className="user-not-connected d-flex flex-column justify-content-center">
          <UserNotConnected isDisabled={!walletDetected} onConnect={() => connectWallet()} />
        </div>
      ) : (
        <div className="user-connected d-flex flex-column justify-content-center">
          {!error && <UserConnected account={currentAccount} />}
          {!error && <Dashboard account={currentAccount} />}
        </div>
      )}

      {!walletDetected && <p className="text-center">You need to install Metamask.</p>}
      {error && <p className="text-center">{error}</p>}
    </div>
  )
}

export default App
