import { contextBridge, ipcRenderer } from "electron";

console.log('load: preload.ts')



contextBridge.exposeInMainWorld('ipc', {
    changeView: (viewItem) => {
        console.log('call: ipc.changeView')
        ipcRenderer.send('changeView', viewItem)
    }
})


