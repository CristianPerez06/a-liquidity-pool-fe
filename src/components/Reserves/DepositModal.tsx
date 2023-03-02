import React, { useCallback, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Form, FormGroup, Label, Input } from 'reactstrap'
import { BasicReserveData } from '../../utilities/types'

interface DepositModalProps {
  assetData: BasicReserveData
  isTxApproved?: boolean
  isLoading?: boolean
  onApproval?: (reserveData: BasicReserveData, amount: number) => void
  onDeposit?: () => void
  onClose?: () => void
  error?: string
}

type Component = (props: DepositModalProps) => JSX.Element

const DepositModal: Component = (props) => {
  const { assetData, onApproval, onDeposit, onClose, isTxApproved = false, isLoading = false, error } = props

  const [amount, setAmount] = useState(0)

  const handleOnApproval = useCallback(() => {
    onApproval?.(assetData, amount)
  }, [isTxApproved])

  const handleOnDeposit = useCallback(() => {
    onDeposit?.()
  }, [isTxApproved])

  const handleOnToggle = useCallback(() => {
    onClose?.()
  }, [])

  const handleAmountOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.currentTarget.value))
  }, [])

  return (
    <div>
      <Modal isOpen toggle={() => !isLoading && handleOnToggle()}>
        <Form>
          <ModalHeader toggle={() => !isLoading && handleOnToggle()}>{`Deposit ${assetData.symbol}`}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input id="amount" placeholder="Enter amount" type="number" onChange={handleAmountOnChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="modal-footer d-flex flex-nowrap">
            {isLoading && (
              <div className="spinner-content w-50">
                <Spinner color="secondary" size="sm"></Spinner>
              </div>
            )}
            <div className="buttons-content w-50 d-flex justify-content-end">
              <Button
                className="ms-2"
                color="primary"
                onClick={handleOnApproval}
                disabled={isTxApproved || isLoading || amount <= 0}
              >
                Approve
              </Button>
              <Button className="ms-2" color="primary" onClick={handleOnDeposit} disabled={!isTxApproved || isLoading}>
                Deposit
              </Button>
              <Button className="ms-2" color="secondary" onClick={handleOnToggle} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </ModalFooter>
          {error && <p className="text-center">{error}</p>}
        </Form>
      </Modal>
    </div>
  )
}

export default DepositModal
