import { contextBridge, ipcRenderer } from "electron";

console.log('load: preload.ts')



export const preload = () => {

    console.log('call: preload')

    contextBridge.exposeInMainWorld('ipc', {
        changeView: (viewItem) => {
            ipcRenderer.send('changeView', viewItem)
        }
    })

}


