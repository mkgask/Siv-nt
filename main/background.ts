import { app, session } from 'electron'
import serve from 'electron-serve'
import log from 'electron-log'

import path from 'path'

import { createWindow } from './helpers'
import logStarter from './helpers/log-starter'
import registerIpc from './helpers/ipc'
import openAssociation from './helpers/open-association'

import Settings from './components/settings'



const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
    serve({ directory: 'app' })

    // 今は開発中なので本番環境でも全部出す
    log.transports.console.level = 'silly'
    log.transports.file.level = 'silly';

    /*
        // TODO: 本番環境ではログファイルの出力をフラグで管理したい
        if (!isLogOutput) {
            log.transports.console.level = false;
            log.transports.file.level = false;
        }
    */
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`)
}



logStarter()



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
            webPreferences.nodeIntegrationInSubFrames = false;
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
    log.debug('load: app.whenReady')

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
        autoHideMenuBar: isProd ? true : false,

        webPreferences: {

            /* レンダラープロセスのコンソールで
             * VM4 sandbox_bundle:2 Unable to load preload script: preload.js
             * のエラーが出るが、動作には支障はない。
             * nodeIntegration: trueにするとエラーが出なくなるが、
             * セキュリティ上良い設定ではないので、一旦これで進める。
            */
            nodeIntegration: true,

            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            sandbox: true,
            contextIsolation: true,

            preload: path.join(__dirname, 'preload.js'),
        },
    })

    registerIpc(mainWindow)
    openAssociation(mainWindow)

    if (isProd) {
        await mainWindow.loadURL('app://./home')
    } else {
        const port = process.argv[2]
        await mainWindow.loadURL(`http://localhost:${port}/home`)
        mainWindow.webContents.openDevTools()
    }

})()

app.on('window-all-closed', () => {
    ;(new Settings).save_all()
    app.quit()
})
