import { app, session } from 'electron'
import serve from 'electron-serve'
import path from 'path'

import { createWindow } from './helpers'
import { registerIpc } from './helpers/ipc'

console.log('load: background.ts')


const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
    serve({ directory: 'app' })
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`)
}



; (async () => {
    // セキュリティのためSandboxモードを有効にする
    app.enableSandbox()

    // ロードコンテンツをローカル動作のみに制限する
    app.on('web-contents-created', (event, contents) => {
        // 外部URLはすべて不許可
        contents.setWindowOpenHandler(({ url }) => {
            if (!url.startsWith('http://localhost/') && !url.startsWith('file://')) {
                return { action: 'deny' }
            }
        })

        // webviewのロードをローカル動作のみに制限する
        contents.on('will-attach-webview', (event, webPreferences, params) => {
            delete webPreferences.preload

            webPreferences.nodeIntegration = false;
            webPreferences.nodeIntegrationInWorker = false;
            webPreferences.sandbox = true;
            webPreferences.contextIsolation = true;

            if (!params.src.startsWith('http://localhost/') && !params.src.startsWith('file://')) {
                event.preventDefault()
            }
        })

        // リンクのクリックをローカル動作のみに制限する
        contents.on('will-navigate', (event, navigationUrl) => {
            const parsedUrl = new URL(navigationUrl)

            if (!parsedUrl.origin.startsWith('http://localhost/') && !parsedUrl.origin.startsWith('file://')) {
                event.preventDefault()
            }
        })
    })

    await app.whenReady()

    // リモートコンテンツはすべて不許可
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        const parsedUrl = new URL(webContents.getURL())
        if (parsedUrl.protocol !== 'app:') { return callback(false) }
    })

    // Content-Security-Policyでlocalhostのみ許可
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    'default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' \'unsafe-hashes\' data: blob:',
                ]
            }
        })
    })

    const mainWindow = createWindow('main', {
        width: 1600,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    registerIpc()

    if (isProd) {
        await mainWindow.loadURL('app://./home')
    } else {
        const port = process.argv[2]
        await mainWindow.loadURL(`http://localhost:${port}/home`)
        mainWindow.webContents.openDevTools()
    }
})()

app.on('window-all-closed', () => {
    app.quit()
})
