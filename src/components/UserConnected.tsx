interface UserConnectedProps {
  account: string
}

type Component = (props: UserConnectedProps) => JSX.Element

const UserConnected: Component = (props) => {
  const { account } = props

  // Truncate wallet address
  const truncateAddress = (input: string) => {
    return input.substring(0, 5) + '...' + input.substring(38)
  }

  return (
    <div className="user-connected">
      <p className="wallet-address text-center">{truncateAddress(account)}</p>
    </div>
  )
}

export default UserConnected
