export interface ChainData {
  chainId: number
  name: string
  baseAssetSymbol: string
  wrappedBaseAssetSymbol: string
  lendingPoolProviderAddress: string
}

export interface BasicReserveData {
  address: string
  symbol: string
  balance: string
  supplyAPY: number
}

export interface ReserveDataWithBalance extends BasicReserveData {
  variableborrowAPY: number
  stableborrowAPY: number
  isIsolated: boolean
}

export interface UserReserveDataWithBalance extends BasicReserveData {
  balanceUSD: string
}

export interface PermitData {
  r: string
  s: string
  v: string
  deadline: number
}

export interface DepositData extends PermitData {
  asset: string
  amount: number
  onBehalfOf: string
}
