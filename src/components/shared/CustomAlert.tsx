import { Alert } from 'reactstrap'

interface AlertProps {
  text: string
}

type Component = (props: AlertProps) => JSX.Element

const CustomAlert: Component = (props) => {
  const { text } = props

  return (
    <div className="container" style={{ maxWidth: 400 + 'px' }}>
      <Alert color="secondary text-center">{text}</Alert>
    </div>
  )
}

export default CustomAlert
