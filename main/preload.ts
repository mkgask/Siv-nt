import { contextBridge, ipcRenderer } from "electron";

console.log('load: preload.ts')



contextBridge.exposeInMainWorld('ipc', {
    changeView: (viewItem) => {
        console.log('call: ipc.changeView')
        ipcRenderer.send('changeView', viewItem)
    },

    onChangeFilePath: (callback) => {
        console.log('call: ipc.onChangeFilePath')
        ipcRenderer.on('changeFilePath', (event, filePath) => callback(filePath))
    },

    onChangeFileSize: (callback) => {
        console.log('call: ipc.onChangeFileSize')
        ipcRenderer.on('changeFileSize', (event, fileSize) => callback(fileSize))
    },
})


