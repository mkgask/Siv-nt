import os from 'os'

import packageJson from '../../package.json'

import font from './font'

import type { EnvType } from '../../commonTypes/env-type'



const platform = os.platform() ?? ''
const os_version = os.version() ?? ''
const os_release = os.release() ?? ''

const env_defaults: EnvType = {
    name: 'Siv-nt',
    description: 'Simple image viewer - nextron',
    version: '0.0.0',
    author: 'mkgask',
    homepage: 'https://zsw.jp',

    isProd: true,
    isDev: false,
    isTest: false,
    nodeEnv: 'production',

    isWindows: true,
    isMac: false,
    isLinux: false,
    platform: "win32",
    os_version: "Unknown OS",
    os_release: "10.0.00000",

    font_styles: font.font_styles
}



class Env {
    readonly name: string = packageJson.name ?? env_defaults.name
    readonly description: string = packageJson.description ?? env_defaults.description
    readonly version: string = packageJson.version ?? env_defaults.version
    readonly author: string = packageJson.author ?? env_defaults.author
    readonly homepage: string = packageJson.homepage ?? env_defaults.homepage

    readonly isProd: boolean = process.env.NODE_ENV ? process.env.NODE_ENV === 'production' : env_defaults.isProd
    readonly isDev: boolean = process.env.NODE_ENV ? process.env.NODE_ENV === 'development' : env_defaults.isDev
    readonly isTest: boolean = process.env.NODE_ENV ? process.env.NODE_ENV === 'test' : env_defaults.isTest
    readonly nodeEnv: string = process.env.NODE_ENV

    readonly isWindows: boolean = platform ? platform === 'win32' : env_defaults.isWindows
    readonly isMac: boolean = platform ? platform === 'darwin' : env_defaults.isMac
    readonly isLinux: boolean = platform ? platform === 'linux' : env_defaults.isLinux
    readonly platform: string = platform ?? env_defaults.platform
    readonly os_version: string = os_version ?? env_defaults.os_version
    readonly os_release: string = os_release ?? env_defaults.os_release

    readonly font_styles: string = font.font_styles ?? env_defaults.font_styles
}



const env = new Env()
export default env


