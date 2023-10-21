import fs from 'fs'

import mime from 'mime-lite'
import Store from 'electron-store'
import log from 'electron-log'

import Media from '../components/media'

import accepted_types from '../components/accepted-types'



export default function openAssociation(mainWindow: Electron.BrowserWindow) {

    // 関連付けを開く
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('call: openAssociation.did-finish-load')
        console.log('call: openAssociation.did-finish-load: process.argv: ' + process.argv.join(', '))

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

        const media = new Media(path, '', type, mime_type)

        const store = new Store()
        store.set('media', media)

        log.debug('changeView: path', media.path)
        log.debug('changeView: b64', !!media.b64)
        log.debug('changeView: type', media.type)
        log.debug('changeView: mime_type', media.mime_type)
        log.debug('changeView: filesize', media.filesize)
        log.debug('changeView: imagesize_w', media.imagesize_w)
        log.debug('changeView: imagesize_h', media.imagesize_h)

        mainWindow.webContents.send('changeView', media)
        mainWindow.webContents.send('changeFileInfo', media)
    })

}


