import { Table } from 'reactstrap'
import { DepositData } from '../../utilities/types'

interface DepositsListProps {
  deposits: DepositData[]
}

type Component = (props: DepositsListProps) => JSX.Element

const DepositsList: Component = (props) => {
  const { deposits } = props

  return (
    <div className="deposits-list mb-4">
      <div className="table-container bg-dark p-4 rounded-4">
        <Table responsive dark hover className="text-center">
          <thead>
            <tr className="text-center fs-4">
              <th>Action</th>
              <th>Transaction</th>
              <th>Amount</th>
            </tr>
          </thead>
          {deposits.length !== 0 ? (
            <tbody>
              {deposits.map((deposit) => {
                return (
                  <tr key={deposit.tx}>
                    <td>Deposit</td>
                    <td>{deposit.tx}</td>
                    <td>{deposit.amount}</td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <th colSpan={4}>
                  <p className="pt-4 pb-0">No deposits available</p>
                </th>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  )
}

export default DepositsList
