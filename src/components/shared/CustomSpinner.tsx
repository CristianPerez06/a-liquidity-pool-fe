import { Spinner } from 'reactstrap'

const CustomSpinner = () => {
  return (
    <div className="container d-flex justify-content-center py-4">
      <Spinner
        color="dark"
        style={{
          height: '10rem',
          width: '10rem',
        }}
      ></Spinner>
    </div>
  )
}

export default CustomSpinner
