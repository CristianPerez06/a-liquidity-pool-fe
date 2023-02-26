import React, { useCallback, useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import UserConnected from './components/UserConnected'
import UserNotConnected from './components/UserNotConnected'
// import { chainIdIsSupported, getChainIdHumanized } from './utilities/helpers'
import { getWalletError } from './utilities/walletErrors'

type Component = () => JSX.Element

const App: Component = () => {
  const [walletDetected, setWalletDetected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  // const [currentChainId, setCurrentChainId] = useState('')
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

      // Check if wallet is connected
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      } else {
        setError('No authorized account found.')
      }

      // // Check if Chain is Supported
      // const chainId = await ethereum.request({ method: 'eth_chainId' })
      // const chainIdHumanized = getChainIdHumanized(chainId)

      // if (!chainIdIsSupported(chainIdHumanized)) {
      //   setError('Chain is not supported.')
      //   return
      // }
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

  useEffect(() => {
    checkWallet()
  }, [currentAccount])

  // useEffect(() => {
  //   checkWallet()
  // }, [currentAccount, currentChainId])

  // // Handle chainChanged event
  // ethereum?.on('chainChanged', (chainId: any) => {
  //   const chainIdHumanized = getChainIdHumanized(chainId)
  //   console.log('Chain ID changed: ', chainIdHumanized)

  //   setCurrentChainId(chainIdHumanized.toString())
  // })

  return (
    <div className="App">
      <h1>A web3 wallet</h1>

      {currentAccount.length === 0 ? (
        <div className="user-not-connected d-flex flex-column justify-content-center">
          <UserNotConnected isDisabled={!walletDetected} onConnect={() => connectWallet()} />
        </div>
      ) : (
        <div className="user-connected d-flex flex-column justify-content-center">
          <UserConnected account={currentAccount} />
          {!error && <Dashboard account={currentAccount} />}
        </div>
      )}

      {!walletDetected && <p>You need to install Metamask.</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default App
