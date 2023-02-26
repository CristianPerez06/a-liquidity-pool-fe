import { reservesDataToUI } from './helpers'

export const fetchReserves = async (chainAddress: string) => {
  try {
    const url = new URL('http://localhost:4400/api/reserves')
    url.search = `chain=${chainAddress}`

    const response = await fetch(url)
    const data = await response.json()

    const reservesDataHumanized = reservesDataToUI(data)
    return reservesDataHumanized
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const fetchUserBalances = async (chainAddress: string, userAddress: string) => {
  try {
    const url = new URL('http://localhost:4400/api/user-balances')
    url.search = `chain=${chainAddress}&user=${userAddress}`

    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}
