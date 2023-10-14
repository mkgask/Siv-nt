import { ipcMain } from "electron"
import Store from "electron-store";

import Media from "../components/media";

console.log('load: ipc.ts')



export default function registerIpc(mainWindow) {

    console.log('call: registerIpc')

    ipcMain.on('changeView', (event, item) => {
        console.log('call: ipcMain.handle.changeView')

        if (!validateSender(event.senderFrame)) return null

        const media = new Media(item.path, '', item.type, '', item.filesize)

        // Storeに保存
        const store = new Store()
        store.set('media', media)

        console.log('changeView: path', media.path)
        console.log('changeView: b64', !!media.b64)
        console.log('changeView: type', media.type)
        console.log('changeView: mime_type', media.mime_type)
        console.log('changeView: filesize', media.filesize)
        console.log('changeView: imagesize_w', media.imagesize_w)
        console.log('changeView: imagesize_h', media.imagesize_h)
        console.log('changeView: dataURI', media.dataURI)

        //mainWindow.webContents.send('changeView', media.dataURI, media.type)
        mainWindow.webContents.send('changeFileInfo', media)
    })

    function validateSender(frame) {
        const url = new URL(frame.url);

        console.log('call: ipcMain.handle.changeView.validateSender: url.host: ' + url.host)
        console.log('call: ipcMain.handle.changeView.validateSender: url.protocol: ' + url.protocol)

        if (url.host.match(/^localhost:?\d*/) || url.protocol === 'file:') return true;
        return false;
    }

}


