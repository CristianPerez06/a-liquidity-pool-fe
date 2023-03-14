export enum ErrorTypes {
  NO_WALLET = 'NO_WALLET',
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  DEFAULT = 'DEFAULT',
}

export interface CustomError {
  type: ErrorTypes
  message: string
}

export const ERRORS = {
  [ErrorTypes.NO_WALLET]: {
    type: ErrorTypes.NO_WALLET,
    message: 'You need to install Metamask.',
  },
  [ErrorTypes.NOT_LOGGED_IN]: {
    type: ErrorTypes.NOT_LOGGED_IN,
    message: 'No authorized account found.',
  },
  [ErrorTypes.UNSUPPORTED_CHAIN]: {
    type: ErrorTypes.UNSUPPORTED_CHAIN,
    message: 'Chain is not supported. Use G\xF6erli.',
  },
  [ErrorTypes.DEFAULT]: {
    type: ErrorTypes.DEFAULT,
    message: 'Oops... something went wrong.',
  },
}
