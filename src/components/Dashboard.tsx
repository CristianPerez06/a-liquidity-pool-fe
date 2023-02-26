import { useState, useEffect, useCallback } from 'react'
import Selection, { Option } from './shared/Selection'
import { balanceToUI, chainsToList, chainsToOptionsList } from '../utilities/helpers'
import { ReserveDataHumanized } from '../utilities/types'
import ReservesList from './ReservesList'
import { fetchReserves, fetchUserBalances } from '../utilities/api'

interface DashboardProps {
  account: string
}

type Component = (props: DashboardProps) => JSX.Element

const Dashboard: Component = (props) => {
  const { account } = props

  const chains = chainsToList()

  const defaultChain = chains[0]

  const [chain, setChain] = useState(defaultChain)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [reserves, setReserves] = useState<ReserveDataHumanized[]>([])

  const options: Option[] = chainsToOptionsList()
  const defaultOption: Option = options.find((x) => x.value === defaultChain.name) as Option

  const onChainSelection = useCallback((value: string) => {
    const selectedChain = chains.find((x) => x.name === value) || defaultChain
    setChain(selectedChain)
  }, [])

  useEffect(() => {
    setError('')

    const fetchData = async () => {
      const reserves = await fetchReserves(chain.address)
      const balances = await fetchUserBalances(chain.address, account)

      // Make unified list with Reserves data and User Wallet balance
      const reservesWithBalance = reserves.map((reserve: any) => {
        const balance = balances.find((b: any) => b.address === reserve.address)

        return {
          ...reserve,
          balance: balanceToUI(balance.balance, reserve.decimals),
        }
      })

      return reservesWithBalance
    }

    setIsLoading(true)
    fetchData()
      .then((res) => {
        setReserves(res)
      })
      .catch(() => {
        setError('Oops... something went wrong.')
      })
      .finally(() => {
        setIsLoading(false)
      })

    // const url = new URL('http://localhost:4400/api/reserves')
    // url.search = `chain=${chain.address}`

    // fetch(url)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.error) {
    //       console.log(res.error)
    //     }
    //     const reservesDataHumanized = reservesDataToUI(res)
    //     setReserves(reservesDataHumanized)
    //   })
    //   .catch(() => {
    //     setError('Oops... something went wrong.')
    //   })
    //   .finally(() => {
    //     setIsLoading(false)
    //   })
  }, [chain])

  return (
    <div className="dashboard">
      <Selection
        options={options}
        defaultOption={defaultOption}
        onOptionClick={onChainSelection}
        isDisabled={isLoading}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && reserves && <ReservesList reserves={reserves} />}
    </div>
  )
}

export default Dashboard
