import { Table } from 'reactstrap'
import { UserReserveDataWithBalance } from '../../utilities/types'

interface UserReservesListProps {
  userReserves: UserReserveDataWithBalance[]
}

type Component = (props: UserReservesListProps) => JSX.Element

const UserReservesList: Component = (props) => {
  const { userReserves } = props

  return (
    <div className="user-reserves-list mb-4">
      <div className="table-container bg-dark p-4 rounded-4">
        <Table responsive dark hover className="text-center">
          <thead>
            <tr className="text-center fs-4">
              <th>Asset</th>
              <th>Balance</th>
              <th>Balance USD</th>
              <th>APY</th>
            </tr>
          </thead>
          {userReserves.length !== 0 ? (
            <tbody>
              {userReserves.map((userReserve) => {
                return (
                  <tr key={userReserve.symbol}>
                    <td>{userReserve.symbol}</td>
                    <td>{userReserve.balance}</td>
                    <td>{userReserve.balanceUSD}</td>
                    <td>{userReserve.supplyAPY}</td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <th colSpan={4}>
                  <p className="pt-4 pb-0">Make your first deposit</p>
                </th>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  )
}

export default UserReservesList
