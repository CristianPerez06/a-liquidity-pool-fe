import { useState, useEffect, useCallback } from 'react'
import { reservesDataWithBalanceToUI, userReservesDataWithBalanceToUI } from '../utilities/helpers'
import { ReserveDataWithBalance, UserReserveDataWithBalance } from '../utilities/types'
import ReservesList from './ReservesList'
import UserReservesList from './UserReservesList'
import { fetchReservesSummary, fetchUserBalances } from '../utilities/api'
import { CHAINS, MOCK_ETH_ADDRESS } from '../utilities/constants'

interface DashboardProps {
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account } = props

  const [isLoading, setIsLoading] = useState(false)
  const [reservesUpToDate, setReservesUpToDate] = useState(false)
  const [error, setError] = useState('')
  const [reservesData, setReservesData] = useState<{
    reservesWithBalances: ReserveDataWithBalance[]
    userReservesWithBalances: UserReserveDataWithBalance[]
  }>()

  const fetchData = async () => {
    const defaultChain = CHAINS.GOERLI
    const reservesSummary = await fetchReservesSummary(defaultChain.address, account)
    const balances = await fetchUserBalances(defaultChain.address, account)

    const reservesWithBalances = reservesDataWithBalanceToUI(
      reservesSummary.reserves,
      balances,
      CHAINS.GOERLI,
      MOCK_ETH_ADDRESS
    )

    const userReservesWithBalances = userReservesDataWithBalanceToUI(
      reservesSummary.userReserves.reserves,
      balances,
      CHAINS.GOERLI,
      MOCK_ETH_ADDRESS
    )

    return { reservesWithBalances: reservesWithBalances, userReservesWithBalances: userReservesWithBalances }
  }

  const handleReservesUpdated = useCallback(() => {
    setReservesUpToDate(false)
  }, [])

  useEffect(() => {
    // If reserves are up to date then fetching data is not needed
    if (reservesUpToDate) {
      return
    }

    console.log('useEffect')
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
    <div className="dashboard">
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center">{error}</p>}
      {!isLoading && !error && reservesData && (
        <div className="container">
          <div className="row">
            <div className="col">
              <ReservesList reserves={reservesData.reservesWithBalances} onDeposit={handleReservesUpdated} />
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
