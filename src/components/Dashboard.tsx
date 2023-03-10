import { useCallback, useEffect, useState } from 'react'
import { fetchAccountBalances, fetchLatestDeposits, fetchReservesSummary } from '../utilities/api'
import { MOCK_ETH_ADDRESS, PROVIDERS_DATA } from '../utilities/constants'
import { accountReservesDataWithBalanceToUI, getChainById, reservesDataWithBalanceToUI } from '../utilities/helpers'
import { DepositData, ReservesData } from '../utilities/types'
import Deposits from './Deposits/Deposits'
import FilterInput from './FilterInput'
import Reserves from './Reserves/Reserves'

interface DashboardProps {
  chainId: number
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account, chainId } = props

  const [isReservesLoading, setIsReservesLoading] = useState(false)
  const [reservesUpToDate, setReservesUpToDate] = useState(false)
  const [reservesError, setReservesError] = useState('')
  const [reservesData, setReservesData] = useState<ReservesData>()

  const [isDepositsLoading, setIsDepositsLoading] = useState(false)
  const [depositsError, setDepositsError] = useState('')
  const [depositsData, setDepositsData] = useState<DepositData[]>([])

  const fetchReservesData = async () => {
    const defaultChain = getChainById(chainId) || PROVIDERS_DATA.GOERLI
    const reservesSummary = await fetchReservesSummary(chainId, account)
    const balances = await fetchAccountBalances(chainId, account)

    const reservesWithBalances = reservesDataWithBalanceToUI(
      reservesSummary.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    const accountReservesWithBalances = accountReservesDataWithBalanceToUI(
      reservesSummary.accountReserves.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    return {
      chainId: defaultChain.chainId,
      accountAddress: account,
      reservesWithBalances: reservesWithBalances,
      accountReservesWithBalances: accountReservesWithBalances,
    }
  }

  const fetchReserves = async () => {
    setReservesError('')
    setIsReservesLoading(true)

    fetchReservesData()
      .then((res) => {
        setReservesData(res)
      })
      .catch(() => {
        setReservesError('There was an error trying to fetch the Pools data')
      })
      .finally(() => {
        setIsReservesLoading(false)
      })
  }

  const fetchDepositsData = async (chainId: number, account: string) => {
    const res = await fetchLatestDeposits(chainId, account)
    return res
  }

  const fetchDeposits = async (chainId: number, account: string) => {
    setDepositsError('')
    setIsDepositsLoading(true)

    fetchDepositsData(chainId, account)
      .then((res) => {
        setDepositsData(res)
      })
      .catch(() => {
        setDepositsError('There was an error trying to fetch the Pools data')
      })
      .finally(() => {
        setIsDepositsLoading(false)
      })
  }

  const handleReservesUpdated = useCallback(() => {
    setReservesUpToDate(false)
  }, [])

  const handleOnChange = useCallback(() => {
    setReservesUpToDate(false)
  }, [])

  useEffect(() => {
    // If reserves are up to date then fetching data is not needed
    if (reservesUpToDate) {
      return
    }

    fetchReserves()
    fetchDeposits(chainId, account)

    const fetch = async () => {
      Promise.allSettled([fetchReserves(), fetchDeposits(chainId, account)])
    }

    fetch().then(() => {
      setReservesUpToDate(true)
    })
  }, [chainId, account, reservesUpToDate])

  return (
    <div className="dashboard mt-4">
      <Reserves
        reservesData={reservesData}
        isLoading={isReservesLoading}
        errorMessage={reservesError}
        onReserveUpdate={handleReservesUpdated}
      />
      <FilterInput onChange={handleOnChange} />
      <Deposits depositsData={depositsData} isLoading={isDepositsLoading} errorMessage={depositsError} />
    </div>
  )
}

export default Dashboard
