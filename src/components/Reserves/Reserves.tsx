import { useCallback } from 'react'
import { ReservesData } from '../../utilities/types'
import ReservesList from '../Reserves/ReservesList'
import AccountReservesList from '../Reserves/AccountReservesList'
import CustomSpinner from '../CustomSpinner'

interface ReservesProps {
  isLoading?: boolean
  errorMessage?: string
  reservesData?: ReservesData
  onNewSupply: (newSupply: any) => void
}

type Component = (props: ReservesProps) => JSX.Element

const Reserves: Component = (props) => {
  const { reservesData, isLoading = false, errorMessage, onNewSupply } = props

  const handleOnNewSupply = useCallback((newSupply: any) => {
    onNewSupply(newSupply)
  }, [])

  return (
    <div className="reserves">
      {isLoading && <CustomSpinner />}
      {errorMessage && <p className="text-center">{errorMessage}</p>}
      {!isLoading && !errorMessage && reservesData && (
        <div className="container">
          <div className="row">
            <ReservesList
              account={reservesData.accountAddress}
              chainId={reservesData.chainId}
              reserves={reservesData.reservesWithBalances}
              onSupply={handleOnNewSupply}
            />
            <AccountReservesList accountReserves={reservesData.accountReservesWithBalances} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Reserves
