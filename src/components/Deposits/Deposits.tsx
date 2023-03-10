import React, { useEffect, useState } from 'react'
import { fetchLatestDeposits } from '../../utilities/api'
import { DepositData } from '../../utilities/types'
import DepositsList from './DepositsList'

interface ReservesProps {
  chainId: number
  account: string
}

type Component = (props: ReservesProps) => JSX.Element

const Deposits: Component = (props) => {
  const { chainId, account } = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState<DepositData[]>([])

  const fetchData = async (chainId: number, account: string) => {
    const res = await fetchLatestDeposits(chainId, account)
    return res
  }

  useEffect(() => {
    fetchData(chainId, account)
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [chainId, account])

  return (
    <div className="deposits">
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center">{error}</p>}
      {!isLoading && !error && items && (
        <div className="container">
          <div className="row justify-content-center">
            <DepositsList deposits={items} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deposits
