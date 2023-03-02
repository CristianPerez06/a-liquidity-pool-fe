import { Button, Table } from 'reactstrap'
import { ReserveDataWithBalance } from '../utilities/types'

interface ReservesListProps {
  reserves: ReserveDataWithBalance[]
  onDeposit: () => void
}

type Component = (props: ReservesListProps) => JSX.Element

const ReservesList: Component = (props) => {
  const { reserves, onDeposit } = props

  return (
    <div className="reserves-list">
      <Table responsive dark hover className="text-center">
        <thead>
          <tr className="fs-4">
            <th>Asset</th>
            <th>Wallet Balance</th>
            <th>APY</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reserves.map((reserve) => {
            return (
              <tr key={reserve.symbol}>
                <td>{reserve.symbol}</td>
                <td>{reserve.balance}</td>
                <td>{reserve.supplyAPY}</td>
                <td>
                  <Button onClick={onDeposit}>Deposit</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ReservesList
