export interface ChainHumanized {
  name: string
  chainId: number
  friendlyName: string
  address: string
}

export interface ReserveDataHumanized {
  name: string
  balance: string
  supplyAPY: number
  variableborrowAPY: number
  stableborrowAPY: number
  isIsolated: boolean
}
