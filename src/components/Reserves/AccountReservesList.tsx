import { Table } from 'reactstrap'
import { AccountReserveDataWithBalance } from '../../utilities/types'

interface AccountReservesListProps {
  accountReserves: AccountReserveDataWithBalance[]
}

type Component = (props: AccountReservesListProps) => JSX.Element

const AccountReservesList: Component = (props) => {
  const { accountReserves } = props

  return (
    <div className="account-reserves-list mb-4">
      <div className="table-container bg-dark p-4 rounded-4">
        <Table responsive dark hover={accountReserves.length !== 0} className="text-center">
          <thead>
            <tr>
              <th colSpan={4} className="fs-2 pb-4">
                Supply
              </th>
            </tr>
            <tr>
              <th>Asset</th>
              <th>Balance</th>
              <th>Balance USD</th>
              <th>APY</th>
            </tr>
          </thead>
          {accountReserves.length !== 0 ? (
            <tbody>
              {accountReserves.map((accountReserve) => {
                return (
                  <tr key={accountReserve.symbol}>
                    <td>{accountReserve.symbol}</td>
                    <td>{accountReserve.balance}</td>
                    <td>{accountReserve.balanceUSD}</td>
                    <td>{accountReserve.supplyAPY}</td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <th colSpan={4}>
                  <p className="pt-4 pb-0">Make your first supply</p>
                </th>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  )
}

export default AccountReservesList
