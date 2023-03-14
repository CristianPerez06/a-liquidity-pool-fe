import { processReserveData, processAccountReservesData } from './helpers'
import { DepositData } from './types'

export const fetchReservesSummary = async (chainId: number, account: string) => {
  try {
    const url = new URL('http://localhost:4400/api/reserves-summary')
    url.search = `chain=${chainId}&account=${account}`

    const response = await fetch(url)
    const data = await response.json()
    const { reserves, userReserves } = data

    const reservesData = processReserveData(reserves)
    const accountReservesData = processAccountReservesData(userReserves)

    return {
      reserves: reservesData,
      accountReserves: accountReservesData,
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const fetchAccountBalances = async (chainId: number, account: string) => {
  try {
    const url = new URL('http://localhost:4400/api/account-balances')
    url.search = `chain=${chainId}&account=${account}`

    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const supplyAsset = async (chainId: number, reserve: any, supplyData: any) => {
  const payload = { chain: chainId, reserve: reserve, data: supplyData }

  try {
    const url = new URL('http://localhost:4400/api/supply-asset')
    const params: any = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    const response = await fetch(url, params)
    const data = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const fetchLatestDeposits = async (chainId: number, account: string) => {
  try {
    const url = new URL('http://localhost:4400/api/latest-deposits')
    url.search = `chain=${chainId}&account=${account}`

    const response = await fetch(url)
    const data: DepositData[] = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const fetchDepositsByFilter = async (chainId: number, account: string, tag: string) => {
  try {
    const url = new URL('http://localhost:4400/api/deposits-by-matching-tag')
    url.search = `chain=${chainId}&account=${account}&tag=${tag}`

    const response = await fetch(url)
    const data: DepositData[] = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}
