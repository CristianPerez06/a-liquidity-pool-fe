import { CHAINS } from './constants'
import { ChainData } from './types'

export const chainsToList = (): ChainData[] => {
  const chains = Object.entries(CHAINS).map((chain) => {
    return {
      name: chain[0],
      chainId: chain[1].chainId,
      baseAssetSymbol: chain[1].baseAssetSymbol,
      address: chain[1].address,
      wrappedBaseAssetSymbol: chain[1].wrappedBaseAssetSymbol,
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

export const processReserveData = (data: any) => {
  return data.map((reserve: any) => {
    return {
      address: reserve.underlyingAsset,
      symbol: reserve.symbol,
      supplyAPY: (reserve.supplyAPY * 100).toFixed(2),
      variableborrowAPY: reserve.variableBorrowAPY * 100,
      stableborrowAPY: formatBalanceNumber(Number(reserve.variableBorrowAPY * 100)),
      isIsolated: reserve.isIsolated,
      decimals: reserve.decimals,
    }
  })
}

export const processUserReservesData = (data: any) => {
  const { userReservesData, netWorthUSD } = data

  const userReserves = userReservesData.map((userReserve: any) => {
    return {
      address: userReserve.underlyingAsset,
      symbol: userReserve.reserve.symbol,
      supplyAPY: formatBalanceNumber(Number(userReserve.reserve.supplyAPY * 100)),
      isIsolated: userReserve.reserve.isIsolated,
      balance: formatBalanceNumber(Number(userReserve.underlyingBalance)),
      balanceUSD: formatBalanceNumber(Number(userReserve.underlyingBalanceUSD)),
      decimals: userReserve.reserve.decimals,
    }
  })

  return {
    balance: Number(netWorthUSD).toFixed(2),
    reserves: userReserves,
  }
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

export const reservesDataWithBalanceToUI = (
  reserves: any,
  balances: any,
  chainData: ChainData,
  mockedEthAddress: string
) => {
  const reservesWithBalance = balances.map((balance: any) => {
    const reserve = reserves.find((r: any) => r.address === balance.address)

    let mergedData
    if (!reserve) {
      const wrappedAssetReserve = reserves.find((r: any) => r.symbol === chainData.wrappedBaseAssetSymbol)
      mergedData = {
        ...wrappedAssetReserve,
        symbol: chainData.baseAssetSymbol,
        address: mockedEthAddress,
        balance: balanceToUI(balance.balance, wrappedAssetReserve.decimals),
      }
    } else {
      mergedData = {
        ...reserve,
        balance: balanceToUI(balance.balance, reserve.decimals),
      }
    }

    return mergedData
  })

  return reservesWithBalance
}

export const userReservesDataWithBalanceToUI = (
  userReserves: any,
  balances: any,
  chainData: ChainData,
  mockedEthAddress: string
) => {
  const userReservesWithBalance = balances.map((balance: any) => {
    const userReserve = userReserves.find((r: any) => r.address === balance.address)

    let mergedData
    if (!userReserve) {
      const wrappedAssetReserve = userReserves.find((r: any) => r.symbol === chainData.wrappedBaseAssetSymbol)
      mergedData = {
        ...wrappedAssetReserve,
        symbol: chainData.baseAssetSymbol,
        address: mockedEthAddress,
        // balance: balanceToUI(balance.balance, wrappedAssetReserve.decimals),
      }
    } else {
      mergedData = {
        ...userReserve,
        // balance: balanceToUI(balance.balance, userReserve.decimals),
      }
    }

    return mergedData
  })

  return userReservesWithBalance.filter((x: any) => x.balanceUSD > 0)
}

export const getChainIdHumanized = (chaindId: string) => {
  return Number(Number(chaindId).toString(10))
}

export const chainIdIsSupported = (chaindId: number) => {
  const chain = chainsToList().find((chain) => chain.chainId === chaindId)
  return !!chain
}

export const formatBalanceNumber = (num: number) => {
  if (num < 0.01) {
    return '< 0.01'
  }
  return num.toFixed(2).toString()
}
