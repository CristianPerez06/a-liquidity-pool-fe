import React, { useCallback, useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export interface Option {
  value: string
  label: string
}

export interface SelectionProps {
  defaultOption: Option
  options: Option[]
  onOptionClick: (value: string) => void
  isDisabled?: boolean
}

type Component = (props: SelectionProps) => JSX.Element

const Selection: Component = (props) => {
  const { options, defaultOption, onOptionClick, isDisabled = false } = props

  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption)

  const handleToggle = useCallback(() => {
    setIsOpen((prevState) => !prevState)
  }, [])

  const handleOptionClick = useCallback((option: Option) => {
    onOptionClick(option.value)
    setSelectedOption(option)
  }, [])

  return (
    <div className="selection">
      <Dropdown isOpen={isOpen} toggle={handleToggle} disabled={isDisabled} style={{ width: 200 + 'px' }}>
        <DropdownToggle caret>{selectedOption.label}</DropdownToggle>
        <DropdownMenu>
          <>
            {options.map((option) => (
              <DropdownItem key={option.value} onClick={() => handleOptionClick(option)}>
                {option.label}
              </DropdownItem>
            ))}
          </>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default Selection
