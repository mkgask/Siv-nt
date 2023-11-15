import os from 'os'

import packageJson from '../../package.json'

import font from './font'



const platform = os.platform() ?? ''

const env_defaults = {
    name: 'Siv-nt',
    description: 'Simple image viewer - nextron',
    version: '0.0.0',
    author: 'mkgask',
    homepage: 'https://zsw.jp',

    isProd: true,
    isDev: false,
    isTest: false,
    platform: platform,
    font_styles: font.font_styles,
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
    readonly platform: string = platform ?? env_defaults.platform
    readonly font_styles: string = font.font_styles ?? env_defaults.font_styles
}



const env = new Env()
export default env


