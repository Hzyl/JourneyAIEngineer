import type { AppMode } from './runtime-config'

export type RuntimeCapabilities = {
  mode: AppMode
  cloudSync: boolean
  workspace: boolean
  testRunner: boolean
  openVsCode: boolean
  gitPublish: boolean
  passiveSecurityAudit: boolean
  localBackup: boolean
}

export const localCapabilities: RuntimeCapabilities = {
  mode: 'local',
  cloudSync: false,
  workspace: true,
  testRunner: true,
  openVsCode: true,
  gitPublish: true,
  passiveSecurityAudit: true,
  localBackup: true,
}

export const hostedCapabilities: RuntimeCapabilities = {
  mode: 'hosted',
  cloudSync: true,
  workspace: false,
  testRunner: false,
  openVsCode: false,
  gitPublish: false,
  passiveSecurityAudit: false,
  localBackup: false,
}
