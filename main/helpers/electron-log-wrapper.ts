import log, { LevelOption, LogFunctions } from 'electron-log'

import fs from 'fs'
import path from 'path'

import env from '../components/env'



export enum logLevel {
    error = 0,
    warn = 1,
    info = 2,
    verbose = 3,
    debug = 4,
    silly = 5,
}

export type logOption = logLevel | false



const electronLogLevel = (level: logOption): LevelOption => {
    switch (level) {
        case false: return false
        case logLevel.error: return 'error'
        case logLevel.warn: return 'warn'
        case logLevel.info: return 'info'
        case logLevel.verbose: return 'verbose'
        case logLevel.debug: return 'debug'
        case logLevel.silly: return 'silly'
        default: return false
    }
}



const space = ' '
const spaces = 4

export const convert = (any: any, deps: number = 0): string => {
    if (Array.isArray(any)) {
        return space.repeat(deps * spaces) +
            any.map(v => convert(v, deps + 1)).join(space)
    }

    if (Object.prototype.toString.call(any) === '[object Object]') {
        const obj = {}
        Object.keys(any).forEach(key => {
            obj[key] = convert(any[key], deps + 1)
        })

        return space.repeat(deps * spaces) +
            JSON.stringify(obj, null, spaces)
    }

    return space.repeat(deps * spaces) +
        any.toString()
}


class ElectronLogWrapper implements LogFunctions
{
    private _level: logOption = false

    start() {
        // electron-logが出力するログのファイル名をカスタマイズ
        const d = new Date()
        const prefix = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + (d.getDate())).slice(-2)
        const devprod = env.isProd ? 'prod' : 'dev'
        const curr = log.transports.file.fileName
    
        // log.transports.file.fileNameを設定するとログファイルが生成されてしまうので、
        // その前にログファイル出力をOFFにしておく
        log.transports.file.level = false;
        log.transports.file.fileName = `${prefix}-${devprod}-${curr}`
    }

    level(level: logOption) {
        this._level = level
    }

    output(params: string, level: logOption) {
        if (this._level === false) return
        if (level === false) return
        if (this._level < level) return

        log.transports.file.level = electronLogLevel(this._level)
        log.log(params)
    }

    error(...params: any[]) {
        this.output(convert(params), logLevel.error)
    }

    warn(...params: any[]) {
        this.output(convert(params), logLevel.warn)
    }

    info(...params: any[]) {
        this.output(convert(params), logLevel.info)
    }

    verbose(...params: any[]) {
        this.output(convert(params), logLevel.verbose)
    }

    debug(...params: any[]) {
        this.output(convert(params), logLevel.debug)
    }

    silly(...params: any[]) {
        this.output(convert(params), logLevel.silly)
    }

    // shortcut to info
    log(...params: any[]) {
        this.output(convert(params), logLevel.info)
    }

    async removeLogFile() {
        const remove_limit_num = 512
        const remove_limit_time = Date.now() - 1000 * 60 * 60 * 24 * 30
    
        // 古いログファイルを削除
        await (async () => {
            const dir = path.dirname(log.transports.file.getFile().path);
            const files = fs.readdirSync(dir)
    
            // ファイルが512以下のときは処理しない
            if (files.length <= remove_limit_num) return
    
            const regex = new RegExp(`^\\d{8}\-.+\\.log$`)
            let remove_count = 0
    
            files.filter(file => regex.test(file)).forEach(file => {
                const fullpath = path.join(dir, file)
                const stat = fs.statSync(fullpath)
    
                // 一ヶ月より古かったら削除
                if (stat.mtimeMs < remove_limit_time) {
                    fs.unlinkSync(fullpath)
                    remove_count += 1
                }
            });
        })()
    }
}



const electronLogWrapper = new ElectronLogWrapper()
export default electronLogWrapper


