import { ipcMain } from "electron"
import log from "electron-log"
import Store from "electron-store"

import Media from "../components/media"
import Settings from "../components/settings"
import packageLicenses from '../components/package-licenses'

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
        log.debug('call: ipcMain.handle.changeView: item.path: ' + item.path)
        log.debug('call: ipcMain.handle.changeView: item.type: ' + item.type)
        log.debug('call: ipcMain.handle.changeView: item.mime_type: ' + item.mime_type)
        log.debug('call: ipcMain.handle.changeView: item.filesize: ' + item.filesize)
        
        if (!validateSender(event.senderFrame)) return null

        const media = new Media(
            item.path,
            item.mime_type,
            item.type,
        )

        log.debug('changeView: path: ', media.path)
        log.debug('changeView: type: ', media.type)
        log.debug('changeView: mime_type: ', media.mime_type)
        log.debug('changeView: filesize: ', media.filesize)
        log.debug('changeView: imagesize_w: ', media.imagesize_w)
        log.debug('changeView: imagesize_h: ', media.imagesize_h)

        mainWindow.webContents.send('changeFileInfo', media)

        media.generateViewerInfo(item.path)

        log.debug('changeView: b64: ', !!media.b64)

        mainWindow.webContents.send('changeView', media)
    })

    ipcMain.on('changeZoomLevel', (event, zoomLevel) => {
        log.debug('call: ipcMain.handle.changeZoomLevel')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('changeZoomLevel', zoomLevel)
    })

    ipcMain.on('toggleMenuBar', (event) => {
        log.debug('call: ipcMain.handle.toggleMenuBar')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('toggleMenuBar')
    })

    ipcMain.on('readyMediaViewer', (event, item) => {
        log.debug('call: ipcMain.handle.readyMediaViewer')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('env', {
            isProd: process.env.NODE_ENV === 'production',
        })
    })

    ipcMain.on('readyFileInfo', (event) => {
        log.debug('call: ipcMain.handle.readyFileInfo')
        if (!validateSender(event.senderFrame)) return null
        
        const settings = new Settings()
        log.debug('call: ipcMain.handle.readyFileInfo: settings', settings)
        mainWindow.webContents.send('settings', settings)
    })

    ipcMain.on('readyPackageLicenses', (event) => {
        log.debug('call: ipcMain.handle.readyPackageLicenses')
        if (!validateSender(event.senderFrame)) return null

        const licenses = packageLicenses()
        log.debug('call: ipcMain.handle.readyPackageLicenses: licenses', licenses)
        mainWindow.webContents.send('packageLicenses', licenses)
    })

    ipcMain.on('settings', (event, key, value) => {
        log.debug('call: ipcMain.handle.settings')

        if (!validateSender(event.senderFrame)) return null

        log.debug('call: ipcMain.handle.settings: key: value', key, ' : ', value)

        const settings = new Settings()
        settings.save(key, value)
    })
}


