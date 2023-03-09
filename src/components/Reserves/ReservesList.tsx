import { useState } from 'react'
import { Button, Table } from 'reactstrap'
import { supplyAsset } from '../../utilities/api'
import { PROVIDERS_DATA } from '../../utilities/constants'
import { confirmTransaction, signPermit } from '../../utilities/ethereum'
import { getChainById, getWalletError } from '../../utilities/helpers'
import { BasicReserveData, SupplyData, ReserveDataWithBalance } from '../../utilities/types'
import SupplyModal from './SupplyModal'

interface ComponentState {
  isModalOpen: boolean
  isLoading: boolean
  isTxApproved: boolean
  modalError: string
  modalData?: BasicReserveData
  supplyData?: SupplyData | undefined
}

interface ReservesListProps {
  account: string
  chainId: number
  reserves: ReserveDataWithBalance[]
  onSupply?: () => void
}

type Component = (props: ReservesListProps) => JSX.Element

const ReservesList: Component = (props) => {
  const { account, chainId, reserves, onSupply } = props

  const initialState = {
    isModalOpen: false,
    isLoading: false,
    isTxApproved: false,
    modalError: '',
    modalData: undefined,
    depositData: undefined,
  }

  const [reserveListState, setReserveListState] = useState<ComponentState>(initialState)

  const chainData = getChainById(chainId) || PROVIDERS_DATA.GOERLI

  const handleOnModalOpen = (asset: BasicReserveData) => {
    setReserveListState((prev: ComponentState) => ({
      ...prev,
      modalData: asset,
      isModalOpen: true,
    }))
  }

  const handleOnModalClose = () => {
    setReserveListState((prev: ComponentState) => ({
      ...prev,
      modalError: '',
      isTxApproved: false,
      isLoading: false,
      isModalOpen: false,
    }))
  }

  const handleOnApproval = async (reserveData: BasicReserveData, amount: number) => {
    setReserveListState((prev: ComponentState) => ({
      ...prev,
      modalError: '',
      isLoading: true,
    }))

    try {
      // const pData = await signPermit(chainData.chainId, account, chainData.lendingPoolProviderAddress)
      // const dData: DepositData = { asset: reserveData.address, amount: amount, onBehalfOf: account, ...pData }
      const dData: SupplyData = { asset: reserveData.address, amount: amount, onBehalfOf: account }
      setReserveListState((prev: ComponentState) => ({
        ...prev,
        depositData: { ...dData },
        isTxApproved: true,
        isLoading: false,
      }))
    } catch (err: any) {
      setReserveListState((prev: ComponentState) => ({
        ...prev,
        modalError: getWalletError(err.code),
        isLoading: false,
      }))
    }
  }

  const handleOnSupply = async () => {
    setReserveListState((prev: ComponentState) => ({
      ...prev,
      modalError: '',
      isLoading: true,
    }))

    try {
      // await confirmTransaction(reserveListState.supplyData?.onBehalfOf, PROVIDERS_DATA.GOERLI.poolProxyAddress)
      await supplyAsset(chainData.chainId, reserveListState.supplyData?.asset, reserveListState.supplyData)

      setReserveListState((prev: ComponentState) => ({
        ...prev,
        isTxApproved: false,
        isModalOpen: false,
      }))
      onSupply?.()
    } catch (err: any) {
      setReserveListState((prev: ComponentState) => ({
        ...prev,
        modalError: getWalletError(err.code),
        isLoading: false,
      }))
    }
  }

  return (
    <div className="reserves-list mb-4">
      {/* Table */}
      <div className="table-container bg-dark p-4 rounded-4">
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
                    <Button
                      onClick={() => {
                        handleOnModalOpen({
                          address: reserve.address,
                          symbol: reserve.symbol,
                          balance: reserve.balance,
                          supplyAPY: reserve.supplyAPY,
                        })
                      }}
                      disabled={!(Number(reserve.balance) > 0)}
                    >
                      Deposit
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      {/* Modal */}
      {reserveListState.isModalOpen && reserveListState.modalData && (
        <SupplyModal
          assetData={reserveListState.modalData}
          onApproval={handleOnApproval}
          onSupply={handleOnSupply}
          onClose={handleOnModalClose}
          isTxApproved={reserveListState.isTxApproved}
          isLoading={reserveListState.isLoading}
          error={reserveListState.modalError}
        />
      )}
    </div>
  )
}

export default ReservesList
