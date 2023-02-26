import { Table } from 'reactstrap'
import { ReserveDataHumanized } from '../utilities/types'

interface UserConnectedProps {
  reserves: ReserveDataHumanized[]
}

type Component = (props: UserConnectedProps) => JSX.Element

const ReservesList: Component = (props) => {
  const { reserves } = props

  return (
    <div className="reserves-list">
      <Table responsive dark>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Wallet Balance</th>
            <th>APY</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reserves.map((reserve) => {
            return (
              <tr key={reserve.name}>
                <td>{reserve.name}</td>
                <td>{reserve.balance}</td>
                <td>{reserve.supplyAPY}</td>
                <td>TO DO</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ReservesList
