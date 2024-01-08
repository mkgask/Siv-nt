import path from 'path'

import { app, dialog, session } from 'electron'
import serve from 'electron-serve'

import env from './components/env'
import settings from './components/settings'

import { createWindow } from './helpers/create-window'
import log from './helpers/electron-log-wrapper'
import { logLevel } from './helpers/electron-log-wrapper'
import registerIpc from './helpers/ipc'
import openAssociation from './helpers/open-association'
import pubsub from "./helpers/pubsub"
import killSameNameProcess from './helpers/kill-same-name-process'



log.start()
log.removeLogFile()



if (env.isProd) {
    serve({ directory: 'app' })

    if (settings.log_output) {
        log.level(logLevel.silly)
        log.categoryMode()
        log.excludeCategories([
            'package-licenses',    // ログがとんでもなく長くなってしまうので一旦exclude
        ])
    } else {
        log.level(logLevel.error)
    }
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`)

    log.level(logLevel.silly)
    log.categoryMode()
    log.excludeCategories([
        'package-licenses',    // ログがとんでもなく長くなってしまうので一旦exclude
    ])
}



process.on('uncaughtException', (error) => {
    log.error('fatal-error', 'Uncaught Exception: error.message: ', error.message)
    log.error('fatal-error', 'Uncaught Exception: error.stack: ', error.stack)

    dialog.showErrorBox('Uncaught Exception',
        'エラーが発生しました。アプリケーションは強制終了されます。\n' +
        'ウィンドウが閉じてもタスクマネージャーにアプリケーションが残っている場合があります。\n' +
        'タスクマネージャーを確認し、残っていたらタスクを終了してください。\n' +
        '\nデバッグ情報:\n' +
        error.message + '\n' +
        error.stack
    )

    app.quit()
})

process.on('unhandledRejection', (reason, promise) => {
    log.error('fatal-error', 'Unhandled Rejection: reason: ', reason)
    log.error('fatal-error', 'Unhandled Rejection: promise: ', promise)

    dialog.showErrorBox('Unhandled Rejection',
        'エラーが発生しました。アプリケーションは強制終了されます。\n' +
        'ウィンドウが閉じてもタスクマネージャーにアプリケーションが残っている可能性があります。\n' +
        'タスクマネージャーを確認し、残っていたらタスクを終了してください。\n' +
        '\nデバッグ情報:\n' +
        reason + '\n' +
        promise
    )

    app.quit()
})



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
    log.debug('boot', 'load: app.whenReady')
    if (!env.isProd) { log.debug('boot', 'env: ', env) }

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
        autoHideMenuBar: env.isProd ? true : false,

        webPreferences: {

            /* レンダラープロセスのコンソールで
             * VM4 sandbox_bundle:2 Unable to load preload script: preload.js
             * のエラーが出るが、動作には支障はない。
             * nodeIntegration: trueにするとエラーが出なくなるが、
             * セキュリティ上良い設定ではないのでfalseで進める。
            */
            nodeIntegration: false,

            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            sandbox: true,
            contextIsolation: true,

            preload: path.join(__dirname, 'preload.js'),
        },
    })

    registerIpc(mainWindow)
    openAssociation(mainWindow)

    if (env.isProd) {
        mainWindow.setMenuBarVisibility(false)
        await mainWindow.loadURL('app://./home')
    } else {
        const port = process.argv[2]
        await mainWindow.loadURL(`http://localhost:${port}/home`)
        mainWindow.webContents.openDevTools()
    }

})()



app.on('window-all-closed', async () => {
    log.debug('app-quit', 'call: window-all-closed')

    settings.save_all()

    if (!env.isProd) { killSameNameProcess() }

    if (pubsub.getSpecialField(pubsub.fields.fileListGenerating)) {
        const endCancelGenerateFileList = new Promise<void>(resolve => {
            pubsub.Subscribe(pubsub.topics.endCancelGenerateFileList, () => {
                log.debug('app-quit', 'call: window-all-closed: app.quit')
                // app.quit()
                //app.exit()
                //killAllProcess(app)
                //env.isMac ? app.quit() : app.exit()
                resolve()
            })
        })

        pubsub.Publish(pubsub.topics.startCanceledGenerateFileList)

        await endCancelGenerateFileList
        env.isMac ? app.quit() : app.exit()
        //app.quit()

    } else {
        log.debug('app-quit', 'call: window-all-closed: app.quit')
        //app.quit()
        //app.exit()
        //killAllProcess(app)
        env.isMac ? app.quit() : app.exit()
        //app.quit()
    }
})


