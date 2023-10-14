import { ipcMain } from "electron"
import Store from "electron-store"
import log from "electron-log"

import Media from "../components/media"

log.debug('load: ipc.ts')



export default function registerIpc(mainWindow) {

    log.debug('call: registerIpc')

    function validateSender(frame) {
        const url = new URL(frame.url);

        log.debug('call: ipcMain.handle.changeView.validateSender: url.host: ' + url.host)
        log.debug('call: ipcMain.handle.changeView.validateSender: url.protocol: ' + url.protocol)

        // デバッグ環境
        if (url.host.match(/^localhost:?\d*/) || url.protocol === 'file:') { return true }

        // 本番環境
        if (url.host === '.' || url.protocol === 'app:') { return true }

        return false
    }

    ipcMain.on('changeView', (event, item) => {
        log.debug('call: ipcMain.handle.changeView')
        log.debug('call: ipcMain.handle.changeView: item.path' + item.path)
        log.debug('call: ipcMain.handle.changeView: item.type' + item.type)
        log.debug('call: ipcMain.handle.changeView: item.mime_type' + item.mime_type)
        log.debug('call: ipcMain.handle.changeView: item.filesize' + item.filesize)

        if (!validateSender(event.senderFrame)) return null

        const media = new Media(item.path, '', item.type, item.mime_type, item.filesize)

        // Storeに保存
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

    ipcMain.on('toggleMenuBar', (event, item) => {
        log.debug('call: ipcMain.handle.toggleMenuBar')

        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('toggleMenuBar')
    })

}


