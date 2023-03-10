import { useCallback } from 'react'
import { ReservesData } from '../../utilities/types'
import ReservesList from '../Reserves/ReservesList'
import AccountReservesList from '../Reserves/AccountReservesList'

interface ReservesProps {
  isLoading?: boolean
  errorMessage?: string
  reservesData?: ReservesData
  onReserveUpdate: () => void
}

type Component = (props: ReservesProps) => JSX.Element

const Reserves: Component = (props) => {
  const { reservesData, isLoading = false, errorMessage, onReserveUpdate } = props

  const handleReservesUpdated = useCallback(() => {
    onReserveUpdate()
  }, [])

  return (
    <div className="reserves">
      {isLoading && <p className="text-center">Loading...</p>}
      {errorMessage && <p className="text-center">{errorMessage}</p>}
      {!isLoading && !errorMessage && reservesData && (
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
