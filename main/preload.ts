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
    onEnv: (callback) => {
        console.log('call: ipcEvent.onEnv')
        ipcRenderer.on('env', (event, env) => callback(env))
    },

    onSettings: (callback) => {
        console.log('call: ipcEvent.onSettings')
        ipcRenderer.on('settings', (event, settings) => callback(settings))
    },

    onChangeView: (callback) => {
        console.log('call: ipcEvent.changeView')
        ipcRenderer.on('changeView', (event, media) => callback(media))
    },

    onChangeFileInfo: (callback) => {
        console.log('call: ipcEvent.onChangeFileInfo')
        ipcRenderer.on('changeFileInfo', (event, media) => callback(media))
    },

    onToggleMenuBar: (callback) => {
        console.log('call: ipcEvent.onToggleMenuBar')
        ipcRenderer.on('toggleMenuBar', () => callback())
    }
})


