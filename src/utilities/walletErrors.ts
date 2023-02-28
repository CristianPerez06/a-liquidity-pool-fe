export const getWalletError = (errorCode: number) => {
  let errMessage = ''
  switch (errorCode) {
    case -32002:
      errMessage = 'You have pending requests in your wallet.'
      break
    case 4001:
      errMessage = 'You have rejected the request to connect your wallet.'
      break
    default:
      errMessage = 'Oops... something went wrong.'
      break
  }
  return errMessage
}
