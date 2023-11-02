import fs from 'fs'

import log from '../helpers/electron-log-wrapper'



export default function packageLicenses() {
    let licenses = []

    if (process.env.NODE_ENV === 'production') {
        // ルートディレクトリ/app/licenses.jsonを読み込む
        const licenses_path = `${process.resourcesPath}/app.asar/app/local-data/licenses.json`

        const exist = fs.existsSync(licenses_path)
        log.debug('packageLicenses: fs.existsSync(licenses_path): ', exist)

        const _licenses = fs.readFileSync(licenses_path, 'utf8')
        licenses = JSON.parse(_licenses)
    } else {
        licenses = require('../../licenses.json')
    }

    return licenses
}


