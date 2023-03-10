import { useState, useEffect, useCallback } from 'react'
import { getChainById, reservesDataWithBalanceToUI, accountReservesDataWithBalanceToUI } from '../../utilities/helpers'
import { ReserveDataWithBalance, AccountReserveDataWithBalance } from '../../utilities/types'
import { fetchReservesSummary, fetchAccountBalances } from '../../utilities/api'
import { PROVIDERS_DATA, MOCK_ETH_ADDRESS } from '../../utilities/constants'
import ReservesList from '../Reserves/ReservesList'
import AccountReservesList from '../Reserves/AccountReservesList'

interface ReservesProps {
  chainId: number
  account: string
}

type Component = (props: ReservesProps) => JSX.Element

const Reserves: Component = (props) => {
  const { account, chainId } = props

  const [isLoading, setIsLoading] = useState(false)
  const [reservesUpToDate, setReservesUpToDate] = useState(false)
  const [error, setError] = useState('')
  const [reservesData, setReservesData] = useState<{
    chainId: number
    accountAddress: string
    reservesWithBalances: ReserveDataWithBalance[]
    accountReservesWithBalances: AccountReserveDataWithBalance[]
  }>()

  const fetchData = async () => {
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
        setError('There was an error trying to fetch the Pools data')
      })
      .finally(() => {
        setIsLoading(false)
        setReservesUpToDate(true)
      })
  }, [reservesUpToDate])

  return (
    <div className="reserves">
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
                onSupply={handleReservesUpdated}
              />
            </div>
            <div className="col">
              <AccountReservesList accountReserves={reservesData.accountReservesWithBalances} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reserves
