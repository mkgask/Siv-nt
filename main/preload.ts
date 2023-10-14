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


