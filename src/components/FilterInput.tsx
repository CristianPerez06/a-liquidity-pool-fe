import { ChangeEvent } from 'react'
import { Input } from 'reactstrap'

interface FilterInputProps {
  defaultValue?: string
  onChange?: (value: string) => void
}

type Component = (props: FilterInputProps) => JSX.Element

const FilterInput: Component = (props) => {
  const { onChange } = props

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.value)
  }

  return (
    <div className="filter-input container">
      <div className="row justify-content-center">
        <div className="wrapper d-flex justify-content-center">
          <div className="input-container w-100 d-flex justify-content-center bg-dark p-4 mb-2 rounded-4">
            <Input placeholder="Filter by tag" style={{ maxWidth: 300 + 'px' }} onChange={handleOnChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterInput
