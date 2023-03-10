import { DepositData } from '../../utilities/types'
import DepositsList from './DepositsList'

interface DepositsProps {
  isLoading?: boolean
  errorMessage?: string
  depositsData?: DepositData[]
}

type Component = (props: DepositsProps) => JSX.Element

const Deposits: Component = (props) => {
  const { depositsData, isLoading = false, errorMessage } = props

  return (
    <div className="deposits">
      {isLoading && <p className="text-center">Loading...</p>}
      {errorMessage && <p className="text-center">{errorMessage}</p>}
      {!isLoading && !errorMessage && depositsData && (
        <div className="container">
          <div className="row justify-content-center">
            <DepositsList deposits={depositsData} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deposits
