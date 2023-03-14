import { DepositData } from '../../utilities/types'
import CustomAlert from '../shared/CustomAlert'
import CustomSpinner from '../shared/CustomSpinner'
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
      {isLoading && <CustomSpinner />}
      {errorMessage && <CustomAlert text={errorMessage} />}
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
