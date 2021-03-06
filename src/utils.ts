import logger from 'logger'
import { resolveTxt } from 'dns'
import { Result, ResultAsync, ok, err } from 'neverthrow'
import { RouteError } from 'errors'
import * as goby from 'goby'
import _ from 'lodash'
import validator from 'validator'

export const isValidPath = (domain: string, rawPath: string): boolean => {
  if (!rawPath.startsWith('/')) {
    return false
  }

  return validator.isURL(domain + rawPath, {
    require_protocol: false,
    // this allows for urls such as 'localhost/yo-dude' to be valid.
    // useful for local development
    require_tld: process.env.NODE_ENV === 'production',
  })
}

/**
 * Used for testing behaviour of the front end and simulating slow endpoints locally.
 */
export const slowDown = <T>(ms: number) => (val: T) =>
  ResultAsync.fromSafePromise<T, RouteError>(
    new Promise((resolve) => {
      if (process.env.NODE_ENV === 'production') {
        resolve(val)
        console.warn('Called `slowDown` in a production environment')
        return
      }

      setTimeout(() => {
        resolve(val)
      }, ms)
    })
  )

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.entries(obj).reduce((subset, [key, val]) => {
    if (keys.includes(key as K)) {
      return subset
    }

    return {
      ...subset,
      [key]: val,
    }
  }, {} as Omit<T, K>)
}

const goby_ = goby.init({
  decorator: (pieces) => pieces.join('-').toLowerCase(),
})

// https://linear.app/parlezvous/issue/PAR-41/better-random-username-generation
export const genRandomUsername = (): string =>
  goby_.generate(['adj', 'pre', 'suf'])

// https://github.com/chriso/validator.js/blob/master/src/lib/isUUID.js
export const isUUID = (str: string): boolean => {
  // v4 uuids only
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  return uuidRegex.test(str)
}

// from https://hexojs.github.io/warehouse/types_cuid.js.html
export const isCuid = (str: string): boolean =>
  str.charAt(0) === 'c' && str.length === 25

export const isObject = (val: unknown): val is Record<string, unknown> =>
  // is object type
  typeof val === 'object' &&
  // and is none of these
  !(
    val === null ||
    Array.isArray(val) ||
    typeof val == 'function' ||
    val instanceof Date
  )

export const camelCase = (val: string): string =>
  // lodash messess with cuid's
  isCuid(val) ? val : _.camelCase(val)

export const txtRecordValue = (uuid: string) =>
  `parlez-vous-site-verification=${uuid}`

type SuccessfulLookup = string[][] | undefined
type FailedLookup = null

type DnsLookupResult = Result<SuccessfulLookup, FailedLookup>

export const failedLookupError = err<SuccessfulLookup, FailedLookup>(null)

export const resolveTXTRecord = (hostname: string) =>
  new Promise<DnsLookupResult>((resolve) => {
    resolveTxt(hostname, (lookupError, result) => {
      if (lookupError) {
        logger.info(
          [
            `[resolveTXTRecord] Error looking up "${hostname}"`,
            lookupError,
          ].join(' - ')
        )

        return resolve(err(null))
      }

      resolve(ok(result))
    })
  })
