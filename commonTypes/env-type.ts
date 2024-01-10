


type EnvType = {
    name: string,
    description: string,
    version: string,
    author: string,
    homepage: string,

    isProd: boolean,
    isDev: boolean,
    isTest: boolean,
    nodeEnv: string,

    isWindows: boolean,
    isMac: boolean,
    isLinux: boolean,
    platform: NodeJS.Platform,
    os_version: string,
    os_release: string,

    font_styles: string,
}



export type {
    EnvType,
}


