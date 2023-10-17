import log from 'electron-log'

import fs from 'fs'
import path from 'path'




export default async function logStarter() {
    const remove_limit_num = 512
    const remove_limit_time = Date.now() - 1000 * 60 * 60 * 24 * 30

    // electron-logが出力するログのファイル名をカスタマイズ
    const d = new Date()
    const prefix = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + (d.getDate())).slice(-2)
    const curr = log.transports.file.fileName
    log.transports.file.fileName = `${prefix}-${curr}`

    // electron-logが出力するログのうち古いファイルを削除
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

        if (0 < remove_count) {
            log.info(`Removed ${remove_count} old log files from ${(new Date(remove_limit_time)).toLocaleString('ja-JP')}`)
        }
    })()

}


