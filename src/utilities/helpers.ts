import { PROVIDERS_DATA } from './constants'
import { ChainData } from './types'

export const chainsToList = (): ChainData[] => {
  const chains = Object.entries(PROVIDERS_DATA).map((chain) => {
    return {
      name: chain[0],
      chainId: chain[1].chainId,
      baseAssetSymbol: chain[1].baseAssetSymbol,
      wrappedBaseAssetSymbol: chain[1].wrappedBaseAssetSymbol,
      lendingPoolProviderAddress: chain[1].lendingPoolProviderAddress,
    }
  })
  return chains
}

export const getProviderDataByChainId = (id: number) => {
  const data = Object.entries(PROVIDERS_DATA).find((x) => x[1].chainId === id)
  return data?.[1]
}

export const getChainById = (id: number) => {
  const chain = chainsToList().find((x) => x.chainId === id)
  return chain
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

export const processAccountReservesData = (data: any) => {
  const { userReservesData, netWorthUSD } = data

  const accountReserves = userReservesData.map((accountReserve: any) => {
    return {
      address: accountReserve.underlyingAsset,
      symbol: accountReserve.reserve.symbol,
      supplyAPY: formatBalanceNumber(Number(accountReserve.reserve.supplyAPY * 100)),
      isIsolated: accountReserve.reserve.isIsolated,
      balance: formatBalanceNumber(Number(accountReserve.underlyingBalance)),
      balanceUSD: formatBalanceNumber(Number(accountReserve.underlyingBalanceUSD)),
      decimals: accountReserve.reserve.decimals,
    }
  })

  return {
    balance: Number(netWorthUSD).toFixed(2),
    reserves: accountReserves,
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

export const accountReservesDataWithBalanceToUI = (
  accountReserves: any,
  balances: any,
  chainData: ChainData,
  mockedEthAddress: string
) => {
  const accountReservesWithBalance = balances.map((balance: any) => {
    const accountReserve = accountReserves.find((r: any) => r.address === balance.address)

    let mergedData
    if (!accountReserve) {
      const wrappedAssetReserve = accountReserves.find((r: any) => r.symbol === chainData.wrappedBaseAssetSymbol)
      mergedData = {
        ...wrappedAssetReserve,
        symbol: chainData.baseAssetSymbol,
        address: mockedEthAddress,
        // balance: balanceToUI(balance.balance, wrappedAssetReserve.decimals),
      }
    } else {
      mergedData = {
        ...accountReserve,
        // balance: balanceToUI(balance.balance, accountReserve.decimals),
      }
    }

    return mergedData
  })

  return accountReservesWithBalance.filter((x: any) => x.balanceUSD > 0)
}

export const getChainIdHumanized = (chaindId: string) => {
  return Number(Number(chaindId).toString(10))
}

export const formatBalanceNumber = (num: number) => {
  if (num < 0.01) {
    return '< 0.01'
  }
  return num.toFixed(2).toString()
}

export const getWalletError = (errorCode: number) => {
  let errMessage = ''
  switch (errorCode) {
    case -32002:
      errMessage = 'You have pending requests in your wallet.'
      break
    case 4001:
      errMessage = 'You have rejected the request to your wallet.'
      break
    default:
      errMessage = 'Oops... something went wrong.'
      break
  }
  return errMessage
}
