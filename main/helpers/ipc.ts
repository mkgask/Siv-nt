import { ipcMain } from "electron"

import log from "./electron-log-wrapper"

import Media from "../components/media"
import mediaList from "../components/media-list"
import env from "../components/env"
import settings from "../components/settings"
import packageLicenses from '../components/package-licenses'

log.debug('boot', 'load: ipc.ts')



let ready = 0
const ready_go = 3

const readyCheck = () => {
    ready += 1
    log.debug('view', 'readyCheck: ready: ', ready)
    return ready_go <= ready
}



export default function registerIpc(mainWindow) {

    log.debug('boot', 'call: registerIpc')

    function validateSender(frame) {
        const url = new URL(frame.url);

        log.debug('ipc', 'call: ipcMain.handle.changeView.validateSender: url.host: ' + url.host)
        log.debug('ipc', 'call: ipcMain.handle.changeView.validateSender: url.protocol: ' + url.protocol)

        // デバッグ環境
        if (url.host.match(/^localhost:?\d*/) || url.protocol === 'file:') { return true }

        // 本番環境
        if (url.host === '.' || url.protocol === 'app:') { return true }

        return false
    }

    ipcMain.on('changeView', (event, item) => {
        log.debug('view', 'call: ipcMain.handle.changeView')
        log.debug('view', 'call: ipcMain.handle.changeView: item.path: ' + item.path)
        log.debug('view', 'call: ipcMain.handle.changeView: item.type: ' + item.type)
        log.debug('view', 'call: ipcMain.handle.changeView: item.mime_type: ' + item.mime_type)
        log.debug('view', 'call: ipcMain.handle.changeView: item.filesize: ' + item.filesize)
        
        if (!validateSender(event.senderFrame)) return null

        const media = new Media(
            item.path,
            item.mime_type,
            item.type,
        )

        log.debug('view', 'changeView: media: ', media)

        mainWindow.webContents.send('changeFileInfo', media)

        media.generateViewerInfo(item.path)

        log.debug('view', 'changeView: b64: ', !!media.b64)

        mainWindow.webContents.send('changeView', media)
    })

    ipcMain.on('mediaList', (event, files) => {
        log.debug('view', 'call: ipcMain.handle.mediaList')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('startLoading')

        // ドロップされた画像を一枚だけ先に表示
        const media = new Media(
            files[0].path,
            files[0].mime_type,
            files[0].type,
        )
        
        mainWindow.webContents.send('changeFileInfo', media)

        media.generateViewerInfo()

        mainWindow.webContents.send('changeView', media)

        // MediaList生成
        (new Promise((resolve, reject) => {
            mediaList.changeList(files)
            
            mediaList.get(
                mediaList.setCurrentIndex(
                    mediaList.getIndexFromPath(files[0].path)
                )
            )

            resolve(0)
        })).then(() => {
            mainWindow.webContents.send('endLoading')
        }).catch((error) => {
            log.error('view', 'call: ipcMain.handle.mediaList: error: ', error)
        })

    })

    ipcMain.on('clickNext', (event) => {
        log.debug('view', 'call: ipcMain.handle.clickNext')
        if (!validateSender(event.senderFrame)) return null

        const media = mediaList.getNext()

        mainWindow.webContents.send('changeFileInfo', media)

        media.generateViewerInfo()

        mainWindow.webContents.send('changeView', media)
    })

    ipcMain.on('clickPrev', (event) => {
        log.debug('view', 'call: ipcMain.handle.clickPrev')
        if (!validateSender(event.senderFrame)) return null

        const media = mediaList.getPrev()

        mainWindow.webContents.send('changeFileInfo', media)

        media.generateViewerInfo()

        mainWindow.webContents.send('changeView', media)
    })

    ipcMain.on('changeZoomLevel', (event, zoomLevel) => {
        log.debug('view', 'call: ipcMain.handle.changeZoomLevel')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('changeZoomLevel', zoomLevel)
    })

    ipcMain.on('toggleMenuBar', (event) => {
        log.debug('view', 'call: ipcMain.handle.toggleMenuBar')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('toggleMenuBar')
    })

    ipcMain.on('readyMediaViewer', (event, item) => {
        log.debug('view', 'call: ipcMain.handle.readyMediaViewer')
        if (!validateSender(event.senderFrame)) return null

        mainWindow.webContents.send('env', env)
        if (readyCheck()) { mainWindow.webContents.send('endLoading')}
    })

    ipcMain.on('readyFileInfo', (event) => {
        log.debug('view', 'call: ipcMain.handle.readyFileInfo')
        if (!validateSender(event.senderFrame)) return null
        
        log.debug('view', 'call: ipcMain.handle.readyFileInfo: settings: ', settings)
        mainWindow.webContents.send('settings', settings)
        if (readyCheck()) { mainWindow.webContents.send('endLoading')}
    })

    ipcMain.on('readyPackageLicenses', (event) => {
        log.debug('package-licenses', 'call: ipcMain.handle.readyPackageLicenses')
        if (!validateSender(event.senderFrame)) return null

        const licenses = packageLicenses()
        // log.debug('package-licenses', 'call: ipcMain.handle.readyPackageLicenses: licenses', licenses)
        // ログがとても長くなってしまうので一旦OFF
        mainWindow.webContents.send('packageLicenses', licenses)
        if (readyCheck()) { mainWindow.webContents.send('endLoading')}
    })

    ipcMain.on('settings', (event, key, value) => {
        log.debug('settings', 'call: ipcMain.handle.settings')

        if (!validateSender(event.senderFrame)) return null

        log.debug('settings', 'call: ipcMain.handle.settings: key: value', key, ' : ', value)

        settings.save(key, value)

        mainWindow.webContents.send('settings', settings)
    })
}


