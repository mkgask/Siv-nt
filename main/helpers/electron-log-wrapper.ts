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
const linefeed = '\n'

const deps_spaces = (deps: number): string => {
    return space.repeat(spaces * (deps < 0 ? 0 : deps))
}

const toString = (any: any, deps: number = 0, inValue: boolean = false): string => {

    /*
        考慮に入っているもの
            undefined
            null
            string
            function
            array
            object
        そのまま文字列として出力されることを期待しているもの
            number
            boolean
            symbol
            bigint
    */

    const s = inValue ? '' : deps_spaces(deps)

    switch (true) {
        case typeof any === 'undefined':
            return s + 'undefined'

        case typeof any === 'string' && inValue:
            return '"' + any.toString() + '"'

        case typeof any === 'string' && 0 < deps:
            return s + '"' + any.toString() + '"'
        
        case typeof any === 'function':
            // 関数名があれば関数名を返す
            const funcName = any.toString().match(/^(function)\s*([^\s(]*)?/)

            if (funcName && funcName[2]) 
                return s + '[function ' + funcName[2] + ']'

            // 関数名が無いがfunctionから始まるものは無名関数として返す
            if (funcName && funcName[1]) 
                return s + '[anonymous function]'

            // それ以外はlambda functionとして返す
            return s + '[lambda function]'

        case Array.isArray(any):
            let array_str = '[' + linefeed
            if (!inValue) deps += 1

            array_str +=
                (any.map(v =>
                    s + deps_spaces(deps) +
                    toString(v, deps + 1, true) + ',' + linefeed
                ).join(space))

            deps -= 1
            array_str += s + deps_spaces(deps) + ']' + (inValue ? '' : linefeed)
            return array_str

        case Object.prototype.toString.call(any) === '[object Object]':
            let object_str = '{' + linefeed
            if (!inValue) deps += 1

            Object.keys(any).forEach((key) => {
                object_str += s + deps_spaces(deps) +
                    key + ': ' + toString(any[key], deps + 1, true) + ',' + linefeed
            })

            deps -= 1
            object_str += s + deps_spaces(deps) + '}' + (inValue ? '' : linefeed)
            return object_str

        default:
            if (any === null) return s + 'null'
            return s + any.toString()
    }
}

export const convert = (category: string, any: any[]): string => {
    return `[${category}] ` + any.map(v => toString(v)).join(space)
}



class ElectronLogWrapper implements LogFunctions
{
    /*  Properties
    */

    private _level: logOption = false
    private _allowed_categories: string[] = []

    // category mode
    // true is only allowed categories are allowed
    // false is all categories are allowed
    private _category_mode: boolean = false



    /*  Foundation
    */

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



    /*  Modules  output
    */

    output(params: string, level: logOption) {
        if (this._level === false) return
        if (level === false) return
        if (this._level < level) return

        log.transports.file.level = electronLogLevel(this._level)
        log.log(params)
    }

    error(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.error)
    }

    warn(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.warn)
    }

    info(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.info)
    }

    verbose(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.verbose)
    }

    debug(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.debug)
    }

    silly(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.silly)
    }

    // shortcut to info
    log(category: string, ...params: any[]) {
        if (!this.isAllowedCategory(category)) return
        this.output(convert(category, params), logLevel.info)
    }



    /*  Modules  log category
    */

    isAllowedCategory(category: string): boolean {
        if (!this._category_mode) return true
        return this._allowed_categories.includes(category)
    }

    categoryMode(mode: boolean = true) {
        this._category_mode = mode
    }

    allowCategories(categories: string[]) {
        this._allowed_categories = [ ...this._allowed_categories, ...categories ]
    }

    clearCategories() {
        this._allowed_categories = []
    }



    /*  Modules  remove log file
    */

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


