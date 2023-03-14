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

export interface AccountReserveDataWithBalance extends BasicReserveData {
  balanceUSD: string
}

export interface PermitData {
  r: string
  s: string
  v: string
  deadline: number
}

// export interface SupplyData extends PermitData {
//   asset: string
//   amount: number
//   onBehalfOf: string
// }

export interface SupplyData {
  asset: string
  amount: number
  onBehalfOf: string
}

export interface DepositData {
  tx: string
  amount: number
  chainid: number
}

export interface ReservesData {
  chainId: number
  accountAddress: string
  reservesWithBalances: ReserveDataWithBalance[]
  accountReservesWithBalances: AccountReserveDataWithBalance[]
}
