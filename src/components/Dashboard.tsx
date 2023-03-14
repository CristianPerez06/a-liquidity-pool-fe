import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import {
  fetchAccountBalances,
  fetchLatestDeposits,
  fetchReservesSummary,
  fetchDepositsByFilter,
} from '../utilities/api'
import { MOCK_ETH_ADDRESS, PROVIDERS_DATA } from '../utilities/constants'
import { accountReservesDataWithBalanceToUI, getChainById, reservesDataWithBalanceToUI } from '../utilities/helpers'
import { DepositData, ReservesData } from '../utilities/types'
import Deposits from './Deposits/Deposits'
import FilterInput from './FilterInput'
import Reserves from './Reserves/Reserves'

interface ReservesInfo {
  isLoading: boolean
  error: string
  data: ReservesData | undefined
}

interface DepositsInfo {
  isLoading: boolean
  error: string
  data: DepositData[] | undefined
}

interface DashboardProps {
  chainId: number
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account, chainId } = props

  const [reservesInfo, setReservesInfo] = useState<ReservesInfo>({
    isLoading: false,
    error: '',
    data: undefined,
  })

  const [depositsInfo, setDepositsInfo] = useState<DepositsInfo>({
    isLoading: false,
    error: '',
    data: [],
  })

  const [depositsDataFiltered, setDepositsDataFiltered] = useState<DepositData[]>()

  const getReservesAndBalances = async () => {
    const defaultChain = getChainById(chainId) || PROVIDERS_DATA.GOERLI
    const reservesSummary = await fetchReservesSummary(chainId, account)
    const balances = await fetchAccountBalances(chainId, account)

    const reservesWithBalances = reservesDataWithBalanceToUI(
      reservesSummary.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    const accountReservesWithBalances = accountReservesDataWithBalanceToUI(
      reservesSummary.accountReserves.reserves,
      balances,
      PROVIDERS_DATA.GOERLI,
      MOCK_ETH_ADDRESS
    )

    return {
      chainId: defaultChain.chainId,
      accountAddress: account,
      reservesWithBalances: reservesWithBalances,
      accountReservesWithBalances: accountReservesWithBalances,
    }
  }

  const getReserves = async () => {
    setReservesInfo((prev) => {
      return { ...prev, error: '', isLoading: true }
    })

    getReservesAndBalances()
      .then((res) => {
        setReservesInfo((prev) => {
          return { ...prev, error: '', isLoading: false, data: res }
        })
      })
      .catch(() => {
        setReservesInfo((prev) => {
          return { ...prev, error: 'There was an error trying to fetch the Pools data.', isLoading: false }
        })
      })
  }

  const getDeposits = async (chainId: number, account: string) => {
    setDepositsInfo((prev) => {
      return { ...prev, error: '', isLoading: true }
    })

    fetchLatestDeposits(chainId, account)
      .then((res) => {
        setDepositsInfo((prev) => {
          return { ...prev, error: '', isLoading: false, data: res }
        })
      })
      .catch(() => {
        setDepositsInfo((prev) => {
          return {
            ...prev,
            error: 'There was an error trying to fetch the Pools data.',
            isLoading: false,
          }
        })
      })
  }

  const getDepositsFiltered = async (chainId: number, account: string, tag: string) => {
    setDepositsInfo((prev) => {
      return { ...prev, error: '', isLoading: true }
    })

    fetchDepositsByFilter(chainId, account, tag)
      .then((res) => {
        console.log(res)
        setDepositsInfo((prev) => {
          return { ...prev, error: '', isLoading: false }
        })
        setDepositsDataFiltered(res)
      })
      .catch(() => {
        setDepositsInfo((prev) => {
          return { ...prev, error: 'There was an error trying to fetch the Deposits data.', isLoading: false }
        })
      })
  }

  const handleOnNewSupply = (newSupply: any) => {
    setDepositsInfo((prev) => {
      const prevList = [...(prev.data || [])]
      prevList.pop()
      return { ...prev, error: '', isLoading: false, data: [newSupply, ...prevList] }
    })
  }

  const handleOnFilter = debounce((value: string) => {
    if (value) {
      getDepositsFiltered(chainId, account, value)
    } else {
      setDepositsDataFiltered(depositsInfo.data)
    }
  }, 200)

  useEffect(() => {
    getReserves()
    getDeposits(chainId, account)
  }, [])

  return (
    <div className="dashboard mt-4">
      <div className="row mx-0 d-flex justify-content-center">
        <div className="col" style={{ maxWidth: 700 + 'px' }}>
          <Reserves
            reservesData={reservesInfo.data}
            isLoading={reservesInfo.isLoading}
            errorMessage={reservesInfo.error}
            onNewSupply={handleOnNewSupply}
          />
        </div>
        <div className="col" style={{ maxWidth: 700 + 'px' }}>
          <div className="container">
            <div className="row justify-content-center">
              <FilterInput onChange={handleOnFilter} />
            </div>
          </div>
          <Deposits
            depositsData={depositsDataFiltered || depositsInfo.data}
            isLoading={depositsInfo.isLoading}
            errorMessage={depositsInfo.error}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
