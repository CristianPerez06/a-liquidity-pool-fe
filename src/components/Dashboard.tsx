import { useState, useEffect, useCallback } from 'react'
import { getChainById, reservesDataWithBalanceToUI, userReservesDataWithBalanceToUI } from '../utilities/helpers'
import { ReserveDataWithBalance, UserReserveDataWithBalance } from '../utilities/types'
import { fetchReservesSummary, fetchUserBalances } from '../utilities/api'
import { PROVIDERS_DATA, MOCK_ETH_ADDRESS } from '../utilities/constants'
import ReservesList from './Reserves/ReservesList'
import UserReservesList from './Reserves/UserReservesList'

interface DashboardProps {
  chainId: number
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account, chainId } = props

  const [isLoading, setIsLoading] = useState(false)
  const [reservesUpToDate, setReservesUpToDate] = useState(false)
  const [error, setError] = useState('')
  const [reservesData, setReservesData] = useState<{
    chainId: number
    accountAddress: string
    reservesWithBalances: ReserveDataWithBalance[]
    userReservesWithBalances: UserReserveDataWithBalance[]
  }>()

  const fetchData = async () => {
    const defaultChain = getChainById(chainId) || PROVIDERS_DATA.GOERLI
    const reservesSummary = await fetchReservesSummary(chainId, account)
    const balances = await fetchUserBalances(chainId, account)

    const reservesWithBalances = reservesDataWithBalanceToUI(
      reservesSummary.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    const userReservesWithBalances = userReservesDataWithBalanceToUI(
      reservesSummary.userReserves.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    return {
      chainId: defaultChain.chainId,
      accountAddress: account,
      reservesWithBalances: reservesWithBalances,
      userReservesWithBalances: userReservesWithBalances,
    }
  }

  const handleReservesUpdated = useCallback(() => {
    setReservesUpToDate(false)
  }, [])

  useEffect(() => {
    // If reserves are up to date then fetching data is not needed
    if (reservesUpToDate) {
      return
    }

    setError('')

    setIsLoading(true)
    fetchData()
      .then((res) => {
        setReservesData(res)
      })
      .catch(() => {
        setError('Oops... something went wrong.')
      })
      .finally(() => {
        setIsLoading(false)
        setReservesUpToDate(true)
      })
  }, [reservesUpToDate])

  return (
    <div className="dashboard mt-4">
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center">{error}</p>}
      {!isLoading && !error && reservesData && (
        <div className="container">
          <div className="row">
            <div className="col">
              <ReservesList
                account={reservesData.accountAddress}
                chainId={reservesData.chainId}
                reserves={reservesData.reservesWithBalances}
                onDeposit={handleReservesUpdated}
              />
            </div>
            <div className="col">
              <UserReservesList userReserves={reservesData.userReservesWithBalances} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
