import { contextBridge, ipcRenderer } from "electron";

console.log('load: preload.ts')



contextBridge.exposeInMainWorld('ipcSend', {
    changeView: (viewItem) => {
        console.log('call: ipcSend.changeView')
        ipcRenderer.send('changeView', viewItem)
    }
})

contextBridge.exposeInMainWorld('ipcEvent', {
    onChangeView: (callback) => {
        console.log('call: ipcEvent.changeView')
        ipcRenderer.on('changeView', (event, dataUrl, type) => callback(dataUrl, type))
    },

    onChangeFilePath: (callback) => {
        console.log('call: ipcEvent.onChangeFilePath')
        ipcRenderer.on('changeFilePath', (event, filePath) => callback(filePath))
    },

    onChangeFileSize: (callback) => {
        console.log('call: ipcEvent.onChangeFileSize')
        ipcRenderer.on('changeFileSize', (event, fileSize) => callback(fileSize))
    },
})



