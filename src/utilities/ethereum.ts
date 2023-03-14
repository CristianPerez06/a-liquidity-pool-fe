import { Buffer } from 'buffer'
import { getChainIdHumanized } from './helpers'
import { PermitData } from './types'

const { ethereum } = window

export const ethDetected = () => {
  return !!ethereum
}

export const getAccounts = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  return accounts
}

export const connect = async () => {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  return accounts
}

export const getChainId = async () => {
  const chainId = await ethereum.request({ method: 'eth_chainId' })
  return chainId
}

export const onChainChanged = (callback: any) => {
  return ethereum?.on('chainChanged', (chainId: any) => {
    console.log('chainChanged')
    const chainIdHumanized = getChainIdHumanized(chainId)
    callback(chainIdHumanized)
  })
}

export const onAccountsChanged = (callback: any) => {
  return ethereum?.on('accountsChanged', (accounts: string[]) => {
    console.log('onAccountsChanged')
    const account = accounts[0] || ''
    callback(account)
  })
}

export const signPermit = async (chainId: number, accountAddress: string, spenderAddress: string) => {
  const from = accountAddress

  const deadline = 50000000000

  const domain = {
    name: 'Permit',
    version: '2',
    // verifyingContract: '0x7b5C526B7F8dfdff278b4a3e045083FBA4028790',
    chainId,
  }

  const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    // { name: 'verifyingContract', type: 'address' },
    { name: 'chainId', type: 'uint256' },
  ]

  const permit = {
    owner: from,
    spender: spenderAddress,
    value: 3000,
    nonce: 1,
    deadline: deadline,
  }

  const Permit = [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ]

  const splitSig = (sig: string) => {
    const pureSig = sig.replace('0x', '')

    const _r = Buffer.from(pureSig.substring(0, 64), 'hex')
    const _s = Buffer.from(pureSig.substring(64, 128), 'hex')
    const _v = Buffer.from(parseInt(pureSig.substring(128, 130), 16).toString())

    return { _r, _s, _v }
  }

  const msgParams = {
    types: {
      EIP712Domain,
      Permit,
    },
    primaryType: 'Permit',
    domain,
    message: permit,
  }

  const sign = await ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [from, JSON.stringify(msgParams)],
  })
  const { _v, _r, _s } = splitSig(sign)
  const v = _v.toString()
  const r = `0x${_r.toString('hex')}`
  const s = `0x${_s.toString('hex')}`

  const res: PermitData = {
    v: v,
    r: r,
    s: s,
    deadline: deadline,
  }

  return res
}

export const confirmTransaction = async (fromAddress: any, toAddress: string) => {
  const result = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: fromAddress,
        to: toAddress,
        value: '0x0',
        gasLimit: '0x5028',
        maxFeePerGas: '0x2540be400',
        maxPriorityFeePerGas: '0x3b9aca00',
      },
    ],
  })
  console.log(result)
}
