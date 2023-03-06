import { processReserveData, processUserReservesData } from './helpers'

export const fetchReservesSummary = async (chainId: number, userAddress: string) => {
  try {
    const url = new URL('http://localhost:4400/api/reserves-summary')
    url.search = `chain=${chainId}&user=${userAddress}`

    const response = await fetch(url)
    const data = await response.json()
    const { reserves, userReserves } = data

    const reservesData = processReserveData(reserves)
    const userReservesData = processUserReservesData(userReserves)

    return {
      reserves: reservesData,
      userReserves: userReservesData,
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const fetchUserBalances = async (chainId: number, userAddress: string) => {
  try {
    const url = new URL('http://localhost:4400/api/user-balances')
    url.search = `chain=${chainId}&user=${userAddress}`

    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const depositAsset = async (chainId: number, reserve: any, depositData: any) => {
  const payload = { chain: chainId, reserve: reserve, data: depositData }

  try {
    const url = new URL('http://localhost:4400/api/deposit-asset')
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
