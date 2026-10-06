import { localApi } from '../api'
import { hostedCapabilities } from './capabilities'
import { runtimeConfig } from './runtime-config'

type LocalApi = typeof localApi

// Do not load the generated curriculum into the desktop bundle. The hosted
// adapter imports it only after a web-beta action needs it; this keeps the
// local executable's first screen independent from the web catalog.
let hostedApiPromise: Promise<LocalApi> | undefined
function loadHostedApi(): Promise<LocalApi> {
  hostedApiPromise ??= import('./hosted/hosted-client').then(({ hostedApi }) => hostedApi as LocalApi)
  return hostedApiPromise
}

const hostedClient = new Proxy({ capabilities: hostedCapabilities }, {
  get(target, property) {
    if (property === 'capabilities') return target.capabilities
    if (typeof property !== 'string') return undefined
    return (...args: unknown[]) => loadHostedApi().then((api) => {
      const operation = api[property as keyof LocalApi]
      if (typeof operation !== 'function') throw new Error(`Hosted client does not support ${property}.`)
      return (operation as (...values: unknown[]) => unknown)(...args)
    })
  },
})

// The App keeps its established API contract while the hosted adapter maps
// string review-card IDs and browser-only behavior behind that boundary.
export const learningClient: LocalApi = (runtimeConfig.mode === 'hosted' ? hostedClient : localApi) as LocalApi
