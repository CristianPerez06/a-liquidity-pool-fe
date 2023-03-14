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
        <Table responsive dark hover={deposits.length !== 0} className="text-center">
          <thead>
            <tr>
              <th colSpan={4} className="fs-2 pb-4">
                Deposits
              </th>
            </tr>
            <tr className="text-center fs-4">
              <th>Action</th>
              <th>Asset</th>
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
                    <td>{deposit.tag}</td>
                    <td>
                      <span className="d-inline-block text-break">{deposit.tx}</span>
                    </td>
                    <td>{deposit.amount}</td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={4}>
                  <p className="pt-4 pb-0">No deposits available</p>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  )
}

export default DepositsList
