import { ipcMain } from "electron"
import Store from "electron-store";

console.log('load: ipc.ts')



export const registerIpc = (mainWindow) => {

    console.log('call: registerIpc')

    ipcMain.on('changeView', (event, item) => {
        console.log('call: ipcMain.handle.changeView')

        if (!validateSender(event.senderFrame)) return null

        // item.pathのファイルを読み込み、base64エンコードする
        const base64 = Buffer.from(item.path).toString('base64')

        // Storeに保存
        const store = new Store()
        store.set('viewItem.path', item.path)
        store.set('viewItem.b64', base64)
        store.set('viewItem.type', item.type)
        store.set('viewItem.size', item.size)

        console.log('changeView: path', item.path)
        console.log('changeView: type', item.type)
        console.log('changeView: size', item.size)

        mainWindow.webContents.send('changeFilePath', item.path)
        mainWindow.webContents.send('changeFileSize', item.size)
    })

    function validateSender(frame) {
        const url = new URL(frame.url);

        console.log('call: ipcMain.handle.changeView.validateSender: url.host: ' + url.host)
        console.log('call: ipcMain.handle.changeView.validateSender: url.protocol: ' + url.protocol)

        if (url.host.match(/^localhost:?\d*/) || url.protocol === 'file:') return true;
        return false;
    }

}


