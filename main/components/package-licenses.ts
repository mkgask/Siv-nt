import fs from 'fs'

import log from '../helpers/electron-log-wrapper'

import append_package_licenses from './package-licenses-append'



export default function packageLicenses() {
    let licenses = []

    if (process.env.NODE_ENV === 'production') {
        // ルートディレクトリ/app/licenses.jsonを読み込む
        const licenses_path = `${process.resourcesPath}/app.asar/app/local-data/licenses.json`

        const exist = fs.existsSync(licenses_path)
        log.debug('package-licenses', 'packageLicenses: fs.existsSync(licenses_path): ', exist)

        const _licenses = fs.readFileSync(licenses_path, 'utf8')
        licenses = JSON.parse(_licenses)
    } else {
        licenses = require('../../licenses.json')
    }

    log.debug('package-licenses', 'packageLicenses: licenses: ', licenses)
    log.debug('package-licenses', 'packageLicenses: append_package_licenses: ', append_package_licenses)

    licenses = { ...licenses, ...append_package_licenses }
    
    // オブジェクトの構造を保ったまま配列に変更
    licenses = Object.keys(licenses).map(key => licenses[key])

    // nameをもとにソート
    licenses.sort((a, b) => {
        if (b.name < a.name) return 1
        if (a.name < b.name) return -1
        return 0
    })

    // オブジェクトに戻す
    licenses = licenses.reduce((obj, item) => {
        const name = item.name ?? ''
        const version = item.version ?? ''

        if (version) {
            obj[name + '@' + version] = item
        } else {
            obj[name] = item
        }

        return obj
    }, {})
    
    log.debug('package-license', 'packageLicenses: licenses: ', licenses)

    return licenses
}


