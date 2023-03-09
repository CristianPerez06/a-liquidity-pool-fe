import React, { useEffect, useState } from 'react'
import { fetchLatestDeposits } from '../../utilities/api'
import { DepositData } from '../../utilities/types'
import DepositsList from './DepositsList'

type Component = () => JSX.Element

const Deposits: Component = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState<DepositData[]>([])

  const fetchData = async () => {
    const res = await fetchLatestDeposits()
    return res
  }

  useEffect(() => {
    fetchData()
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])

  return (
    <div className="deposits">
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center">{error}</p>}
      {!isLoading && !error && items && (
        <div className="container">
          <div className="row">
            <DepositsList deposits={items} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Deposits
