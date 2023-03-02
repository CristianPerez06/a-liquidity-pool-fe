import { Table } from 'reactstrap'
import { UserReserveDataWithBalance } from '../utilities/types'

interface UserReservesListProps {
  userReserves: UserReserveDataWithBalance[]
}

type Component = (props: UserReservesListProps) => JSX.Element

const UserReservesList: Component = (props) => {
  const { userReserves } = props

  return (
    <div className="user-reserves-list">
      <Table responsive dark hover className="text-center">
        <thead>
          <tr className="text-center fs-4">
            <th>Asset</th>
            <th>Balance</th>
            <th>Balance USD</th>
            <th>APY</th>
          </tr>
        </thead>
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
      </Table>
    </div>
  )
}

export default UserReservesList
