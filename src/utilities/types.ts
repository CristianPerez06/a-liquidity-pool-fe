export interface ChainData {
  chainId: number
  address: string
  name: string
  baseAssetSymbol: string
  wrappedBaseAssetSymbol: string
}

export interface ChainHumanized {
  name: string
  chainId: number
  friendlyName: string
  address: string
}

export interface ReserveDataWithBalance {
  symbol: string
  balance: string
  supplyAPY: number
  variableborrowAPY: number
  stableborrowAPY: number
  isIsolated: boolean
}

export interface UserReserveDataWithBalance {
  symbol: string
  balance: string
  balanceUSD: string
  supplyAPY: number
}
