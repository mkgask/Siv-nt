import fs from 'fs'

import mime from 'mime-lite'
import log from './electron-log-wrapper'

import Media from '../components/media'
import fileOpen from './file-open'

import { get_media_type, is_accepted } from '../components/accepted-types'

console.log('file-association', 'load: open-association.ts')



export default function openAssociation(mainWindow: Electron.BrowserWindow) {

    // 関連付けを開く
    mainWindow.webContents.on('did-finish-load', () => {
        log.debug('file-association', 'call: openAssociation.did-finish-load')
        log.debug('file-association', 'call: openAssociation.did-finish-load: process.argv: ' + process.argv.join(', '))

        let path = ''
        let mime_type = ''
        let type = ''

        // 最初の有効な一個だけ受け付ける
        for (const arg of process.argv) {
            if (!arg) { continue }
            if (!fs.existsSync(arg)) { continue }
            if (!fs.statSync(arg).isFile()) { continue }

            mime_type = mime.getType(arg)

            log.debug('file-association', 'call: openAssociation.did-finish-load: ', arg, ' : ', mime_type, ' : ', is_accepted(mime_type))
            console.log('file-association', 'call: openAssociation.did-finish-load: ', arg, ' : ', mime_type, ' : ', is_accepted(mime_type))

            if (!is_accepted(mime_type)) { continue }

            type = get_media_type(mime_type) ?? ''

            log.debug('file-association', 'call: openAssociation.did-finish-load: type: ', type)
            console.log('file-association', 'call: openAssociation.did-finish-load: type: ', type)

            if (!type) { continue }

            path = arg
            break
        }

        log.debug('file-association', 'call: openAssociation.did-finish-load: path: ', path)

        if (!path) {
            log.debug('file-association', 'call: openAssociation.did-finish-load: path nothing')

            setTimeout(() => {
                mainWindow.webContents.send('endLoading')
            }, 128)
            return
        }

        fileOpen([
            new Media(
                path,
                mime_type,
                type,
            )
        ], mainWindow)
    })

}


