import log, { LevelOption, LogFunctions } from 'electron-log'

import fs from 'fs'
import path from 'path'

import env from '../components/env'



enum logLevel {
    error = 0,
    warn = 1,
    info = 2,
    verbose = 3,
    debug = 4,
    silly = 5,
}

type logOption = logLevel | false



const electronLogLevel = (level: logOption): LevelOption => {
    switch (level) {
        case logLevel.error: return 'error'
        case logLevel.warn: return 'warn'
        case logLevel.info: return 'info'
        case logLevel.verbose: return 'verbose'
        case logLevel.debug: return 'debug'
        case logLevel.silly: return 'silly'

        case false:
        default:
            return false
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

    if (typeof any === 'undefined')
        return s + 'undefined'

    if (typeof any === 'string' && inValue)
        return '"' + any.toString() + '"'

    if (typeof any === 'string' && 0 < deps)
        return s + '"' + any.toString() + '"'

    if (typeof any === 'function') {
        // 関数名があれば関数名を返す
        const funcName = any.toString().match(/^(function)\s*([^\s(]*)?/)

        if (funcName && funcName[2]) 
            return s + '[function ' + funcName[2] + ']'

        // 関数名が無いがfunctionから始まるものは無名関数として返す
        if (funcName && funcName[1]) 
            return s + '[anonymous function]'

        // それ以外はlambda functionとして返す
        return s + '[lambda function]'
    }

    if (Array.isArray(any)) {
        let array_str = '['
        if (!inValue) deps += 1

        const array_str2 =
            (any.map(v =>
                s + deps_spaces(deps) +
                toString(v, deps + 1, true) + ',' + linefeed
            ).join(''))

        deps -= 1

        if (!array_str2 && deps === 0) {
            array_str += ']'
            return array_str
        }

        array_str += linefeed + array_str2 +
            s + deps_spaces(deps) +
            ']' + (inValue ? '' : linefeed)
        return array_str
    }

    if (Object.prototype.toString.call(any) === '[object Object]') {
        if (Object.keys(any).length === 0) return s + '{}'
        if (any.constructor.name === 'BigInt') return s + any.toString()

        let object_str = '{'
        if (!inValue) deps += 1

        let object_str2 = ''

        Object.keys(any).forEach((key) => {
            object_str2 += s + deps_spaces(deps) +
                key + ': ' + toString(any[key], deps + 1, true) + ',' + linefeed
        })

        if (!object_str2 && deps === 0) {
            object_str += '}'
            return object_str
        }

        deps -= 1
        object_str += linefeed + object_str2 +
            s + deps_spaces(deps) +
            '}' + (inValue ? '' : linefeed)
        return object_str
    }

    if (any === null)
        return s + 'null'

    return s + any.toString()
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



    private _fileName: string = ''



    /*  for Test
     */
    getLevel(): logOption { return this._level }
    getAllowedCategories(): string[] { return this._allowed_categories }
    getCategoryMode(): boolean { return this._category_mode }
    getFileName(): string { return this._fileName }



    /*  Foundation
    */

    start() {
        if ( this._fileName ) { return }

        // electron-logが出力するログのファイル名をカスタマイズ
        const d = new Date()
        const prefix = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + (d.getDate())).slice(-2)
        const devProd = env.isProd ? 'prod' : 'dev'
        const curr = log.transports.file.fileName
        const fileName = `${prefix}-${devProd}-${curr}`

        // log.transports.file.fileNameを設定するとログファイルが生成されてしまうので、
        // その前にログファイル出力をOFFにしておく
        log.transports.file.level = false;
        log.transports.file.fileName = fileName
        this._fileName = fileName
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

        switch (level) {
            case logLevel.error: log.error(params); break
            case logLevel.warn: log.warn(params); break
            case logLevel.info: log.info(params); break
            case logLevel.verbose: log.verbose(params); break
            case logLevel.debug: log.debug(params); break
            case logLevel.silly: log.silly(params); break
            default: throw new Error('!!! FATAL ERROR !!! : unknown log level')
        }
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

export {
    logLevel,
    electronLogLevel,
    deps_spaces,
    toString,
    ElectronLogWrapper,
}

export type { logOption }


