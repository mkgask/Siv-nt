import fs from 'fs'

import mime from 'mime-lite'
import log from './electron-log-wrapper'

import Media from '../components/media'

import accepted_types from '../components/accepted-types'



export default function openAssociation(mainWindow: Electron.BrowserWindow) {

    // 関連付けを開く
    mainWindow.webContents.on('did-finish-load', () => {
        log.debug('call: openAssociation.did-finish-load')
        log.debug('call: openAssociation.did-finish-load: process.argv: ' + process.argv.join(', '))

        let path = ''
        let mime_type = ''
        let type = ''

        // 最初の有効な一個だけ受け付ける
        for (const arg of process.argv) {
            if ( !arg ) { continue }
            if ( !fs.existsSync(arg) ) { continue }
            if ( !fs.statSync(arg).isFile() ) { continue }

            mime_type = mime.getType(arg)
            type = accepted_types[mime_type]
            if ( !type ) { continue }

            path = arg
            break
        }

        const media = new Media(path, mime_type, type)

        log.debug('call: openAssociation: changeFileInfo: media: ', media)

        mainWindow.webContents.send('changeFileInfo', media)
        
        media.generateViewerInfo(path)

        log.debug('call: openAssociation: changeView: b64: ', !!media.b64)

        mainWindow.webContents.send('changeView', media)
    })

}


