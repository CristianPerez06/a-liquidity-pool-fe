import { Button } from 'reactstrap'

interface UserNotConnectedProps {
  isDisabled: boolean
  onConnect: () => void
}

type Component = (props: UserNotConnectedProps) => JSX.Element

const UserNotConnected: Component = (props) => {
  const { isDisabled = false, onConnect } = props

  return (
    <div className="user-not-connected text-center">
      <Button onClick={onConnect} disabled={isDisabled}>
        Connect Wallet
      </Button>
    </div>
  )
}

export default UserNotConnected
