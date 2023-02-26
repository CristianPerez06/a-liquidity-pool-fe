import { CHAINS } from './constants'
import { ChainHumanized } from './types'

export const chainsToList = (): ChainHumanized[] => {
  const chains = Object.entries(CHAINS).map((chain) => {
    return {
      name: chain[0],
      chainId: chain[1].chainId,
      friendlyName: chain[1].name,
      address: chain[1].address,
    }
  })
  return chains
}

export const chainsToOptionsList = () => {
  const chains = Object.entries(CHAINS).map((chain) => {
    return {
      value: chain[0],
      label: chain[1].name,
    }
  })
  return chains
}

export const reservesDataToUI = (reservesData: any) => {
  return reservesData.map((reserve: any) => {
    return {
      address: reserve.underlyingAsset,
      name: reserve.name,
      supplyAPY: (reserve.supplyAPY * 100).toFixed(2),
      variableborrowAPY: (reserve.variableBorrowAPY * 100).toFixed(2),
      stableborrowAPY: (reserve.variableBorrowAPY * 100).toFixed(2),
      isIsolated: reserve.isIsolated,
      decimals: reserve.decimals,
    }
  })
}

export const balanceToUI = (balance: string, decimals: number) => {
  const numBalance = Number(balance)

  let readableBalance = '0.00'
  if (numBalance > 0) {
    let dividedBy = '1'
    for (let i = 0; i < decimals; i++) {
      dividedBy += '0'
    }
    readableBalance = (numBalance / Number(dividedBy)).toFixed(2).toString()
  }
  return readableBalance
}

export const getChainIdHumanized = (chaindId: string) => {
  return Number(Number(chaindId).toString(10))
}

export const chainIdIsSupported = (chaindId: number) => {
  const chain = chainsToList().find((chain) => chain.chainId === chaindId)
  return !!chain
}
