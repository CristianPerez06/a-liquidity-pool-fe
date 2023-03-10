import { Input } from 'reactstrap'

interface FilterInputProps {
  onChange?: () => void
}

type Component = (props: FilterInputProps) => JSX.Element

const FilterInput: Component = () => {
  return (
    <div className="filter-input container">
      <div className="row justify-content-center">
        <div className="wrapper d-flex justify-content-center" style={{ maxWidth: 700 + 'px' }}>
          <div
            className="input-container w-100 d-flex justify-content-center bg-dark pt-4 pe-4 pb-0 ps-4"
            style={{ borderTopLeftRadius: 10 + 'px', borderTopRightRadius: 10 + 'px' }}
          >
            <Input placeholder="Filter by tag" style={{ maxWidth: 300 + 'px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterInput
