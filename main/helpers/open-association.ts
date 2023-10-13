import fs from 'fs'
import mime from 'mime-lite'


const accepted_types = {
    'image/png': 'image',
    'image/apng': 'image',
    'image/jpeg': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/svg+xml': 'image',
    'image/webp': 'image',
    'image/avif': 'image',
    /*
        'video/mp4': 'video',
        'video/webm': 'video',
        'video/ogg': 'video',
        'video/quicktime': 'video',
        'video/x-msvideo': 'video',
        'video/x-ms-wmv': 'video',
    
        'audio/mp4': 'audio',
        'audio/mpeg': 'audio',
        'audio/ogg': 'audio',
        'audio/wav': 'audio',
        'audio/webm': 'audio',
    */
}

export default function openAssociation(mainWindow: Electron.BrowserWindow) {

    // 関連付けを開く
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('call: openAssociation.did-finish-load')
        console.log('call: openAssociation.did-finish-load: process.argv: ' + process.argv.join(', '))

        let path = ''
        let open_src = ''
        let mime_type = ''
        let type = ''

        // 最初の有効な一個だけ受け付ける
        for (const arg of process.argv) {
            if ( !arg ) { continue }
            if ( !fs.existsSync(arg) ) { continue }
            if ( !fs.statSync(arg).isFile() ) { continue }

            mime_type = mime.getType(arg)
            type = accepted_types[mime_type]
            if ( !type ) { continue }

            path = arg
            break
        }

        // データURIを作成
        if (path) {
            const base64 = Buffer.from(path).toString('base64')
            open_src = `data:${mime_type};base64,${base64}`
        }

        mainWindow.webContents.send('changeView', open_src, type)
        mainWindow.webContents.send('changeFilePath', path)
        // mainWindow.webContents.send('changeFileSize', filesize)
        // mainWindow.webContents.send('changeFileSize', imagesize)
    })

}


