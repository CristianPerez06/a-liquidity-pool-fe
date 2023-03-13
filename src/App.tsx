import React, { useCallback, useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import UserConnected from './components/UserConnected'
import UserNotConnected from './components/UserNotConnected'
import { PROVIDERS_DATA } from './utilities/constants'
import {
  connect,
  ethDetected,
  getAccounts,
  getChainId,
  onAccountsChanged,
  onChainChanged,
  // onConnect,
  // onDisconnect,
} from './utilities/ethereum'
import { getChainIdHumanized, getWalletError } from './utilities/helpers'

enum ErrorTypes {
  NO_WALLET = 'NO_WALLET',
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  DEFAULT = 'DEFAULT',
}

interface Error {
  type: ErrorTypes
  message: string
}

const ERRORS = {
  [ErrorTypes.NO_WALLET]: {
    type: ErrorTypes.NO_WALLET,
    message: 'You need to install Metamask.',
  },
  [ErrorTypes.NOT_LOGGED_IN]: {
    type: ErrorTypes.NOT_LOGGED_IN,
    message: 'No authorized account found.',
  },
  [ErrorTypes.UNSUPPORTED_CHAIN]: {
    type: ErrorTypes.UNSUPPORTED_CHAIN,
    message: 'Chain is not supported. Use G\xF6erli.',
  },
  [ErrorTypes.DEFAULT]: {
    type: ErrorTypes.DEFAULT,
    message: 'Oops... something went wrong.',
  },
}

type Component = () => JSX.Element

const App: Component = () => {
  const [currentChainId, setCurrentChainId] = useState(PROVIDERS_DATA.GOERLI.chainId)
  const [currentAccount, setCurrentAccount] = useState('')
  const [error, setError] = useState<Error | undefined>()

  // Check wallet
  const checkWallet = async () => {
    setError(undefined)

    try {
      // Check if wallet is installed
      if (!ethDetected()) {
        setError(ERRORS[ErrorTypes.NO_WALLET])
        return
      }

      // Check if Chain is Supported
      const supportedChain = PROVIDERS_DATA.GOERLI.chainId
      if (supportedChain !== currentChainId) {
        setError(ERRORS[ErrorTypes.UNSUPPORTED_CHAIN])
        return
      }

      // Check if wallet is connected
      const accounts = await getAccounts()
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      } else {
        setError(ERRORS[ErrorTypes.NOT_LOGGED_IN])
      }
    } catch (error) {
      setError(ERRORS[ErrorTypes.DEFAULT])
    }
  }

  // Handle Connect wallet click
  const connectWallet = useCallback(async () => {
    setError(undefined)

    try {
      const accounts = await connect()
      if (accounts.length === 0) {
        setError(ERRORS[ErrorTypes.NOT_LOGGED_IN])
        return
      }

      setCurrentAccount(accounts[0])
    } catch (error: any) {
      const errMessage = getWalletError(error.code)
      setError({ type: ErrorTypes.DEFAULT, message: errMessage })
    }
  }, [])

  // Handle events
  onChainChanged(setCurrentChainId)
  onAccountsChanged(setCurrentAccount)

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

  const walletError = error ? error.type === ERRORS.NO_WALLET.type : false
  const chainError = error ? error.type === ERRORS.UNSUPPORTED_CHAIN.type : false

  return (
    <div className="App">
      <h1 className="fs-1 fw-bold text-center my-4">A liquidity pool</h1>

      {currentAccount.length === 0 ? (
        <div className="user-not-connected d-flex flex-column justify-content-center my-4">
          <UserNotConnected isDisabled={walletError || chainError} onConnect={() => connectWallet()} />
        </div>
      ) : (
        <div className="user-connected d-flex flex-column justify-content-center my-4">
          {!error && <UserConnected account={currentAccount} />}
          {!error && <Dashboard account={currentAccount} chainId={currentChainId} />}
        </div>
      )}

      {error && <p className="text-center">{error.message}</p>}
    </div>
  )
}

export default App
