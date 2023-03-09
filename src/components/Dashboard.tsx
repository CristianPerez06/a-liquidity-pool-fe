import Deposits from './Deposits/Deposits'
import Reserves from './Reserves/Reserves'

interface DashboardProps {
  chainId: number
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account, chainId } = props

  return (
    <div className="dashboard mt-4">
      <Reserves chainId={chainId} account={account} />
      <Deposits />
    </div>
  )
}

export default Dashboard
