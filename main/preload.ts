import { contextBridge, ipcRenderer } from "electron";

console.log('load: preload.ts')



/* ipcSend
 * 
 * RendererからMainにメッセージを送る
 * Only send message to Main from Renderer
 * 
 * 
*/
contextBridge.exposeInMainWorld('ipcSend', {
    changeView: (viewItem) => {
        console.log('call: ipcSend.changeView')
        ipcRenderer.send('changeView', viewItem)
    },

    mediaList: (mediaList) => {
        console.log('call: ipcSend.mediaList')
        ipcRenderer.send('mediaList', mediaList)
    },

    clickNext: () => {
        console.log('call: ipcSend.clickNext')
        ipcRenderer.send('clickNext')
    },

    clickPrev: () => {
        console.log('call: ipcSend.clickPrev')
        ipcRenderer.send('clickPrev')
    },

    changeZoomLevel: (zoomLevel) => {
        console.log('call: ipcSend.changeZoomLevel')
        ipcRenderer.send('changeZoomLevel', zoomLevel)
    },

    toggleMenuBar: () => {
        console.log('call: ipcSend.toggleMenuBar')
        ipcRenderer.send('toggleMenuBar')
    },

    readyMediaViewer: () => {
        console.log('call: ipcSend.readyMediaViewer')
        ipcRenderer.send('readyMediaViewer')
    },

    readyFileInfo: () => {
        console.log('call: ipcSend.readyFileInfo')
        ipcRenderer.send('readyFileInfo')
    },

    readyPackageLicenses: () => {
        console.log('call: ipcSend.readyPackageLicenses')
        ipcRenderer.send('readyPackageLicenses')
    },

    readyNextPrev: () => {
        console.log('call: ipcSend.readyNextPrev')
        ipcRenderer.send('readyNextPrev')
    },

    settings: (key, value) => {
        console.log('call: ipcSend.settings')
        ipcRenderer.send('settings', key, value)
    }
})



/*
 * ipcEvent
 * 
 * MainからRendererにメッセージを送る
 * Only send message to Renderer from Main
 *
*/
contextBridge.exposeInMainWorld('ipcEvent', {
    off: (channel, listener) => {
        console.log('call: ipcEvent.off')
        ipcRenderer.removeListener(channel, listener)
    },

    onEnv: (callback) => {
        console.log('call: ipcEvent.onEnv')
        ipcRenderer.on('env', (event, env) => callback(env))
    },

    onSettings: (callback) => {
        console.log('call: ipcEvent.onSettings')
        ipcRenderer.on('settings', (event, settings) => callback(settings))
    },

    onPackageLicenses: (callback) => {
        console.log('call: ipcEvent.onPackageLicenses')
        ipcRenderer.on('packageLicenses', (event, licenses) => callback(licenses))
    },

    onChangeView: (callback) => {
        console.log('call: ipcEvent.changeView')
        ipcRenderer.on('changeView', (event, media) => callback(media))
    },

    onChangeFileInfo: (callback) => {
        console.log('call: ipcEvent.onChangeFileInfo')
        ipcRenderer.on('changeFileInfo', (event, media) => callback(media))
    },

    onChangeZoomLevel: (callback) => {
        console.log('call: ipcEvent.onChangeZoomLevel')
        ipcRenderer.on('changeZoomLevel', (event, zoomLevel) => callback(zoomLevel))
    },

    onToggleMenuBar: (callback) => {
        console.log('call: ipcEvent.onToggleMenuBar')
        ipcRenderer.on('toggleMenuBar', () => callback())
    },

    onStartLoading: (callback) => {
        console.log('call: ipcEvent.onStartLoading')
        ipcRenderer.on('startLoading', () => callback())
    },

    onProgressFileLoading: (callback) => {
        console.log('call: ipcEvent.onProgressFileLoading')
        ipcRenderer.on('progressFileLoading', (event, current, max) => callback(current, max))
    },

    onEndLoading: (callback) => {
        console.log('call: ipcEvent.onEndLoading')
        ipcRenderer.on('endLoading', () => callback())
    }
})


