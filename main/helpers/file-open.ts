import { BrowserWindow } from "electron";

import log from "./electron-log-wrapper";
import Media from "../components/media";
import mediaList from "../components/media-list";



export default function fileOpen(files, window: BrowserWindow): void {
    log.debug('file-open', 'call: fileOpen: files: ', files)

    // ドロップされた画像を一枚だけ先に表示
    let media = null

    // filesが文字列
    if ( typeof files === 'string' ) {
        media = new Media(
            files,
            '',
            '',
        )
    } else
    // filesが配列
    if ( Array.isArray(files) ) {
        media = new Media(
            files[0].path,
            files[0].mime_type,
            files[0].type,
        )
    } else
    // filesがオブジェクト
    if ( typeof files === 'object' && files.hasOwnProperty('path') ) {
        media = new Media(
            files.path,
            files.mime_type,
            files.type,
        )
    }

    log.debug('file-open', 'call: fileOpen: media: ', media)

    window.webContents.send('changeFileInfo', media)

    media.generateViewerInfo()

    window.webContents.send('changeView', media)

    try {
        window.webContents.send('startLoading')

        mediaList.changeList(
            files,

            (current, length) => {
                window.webContents.send('progressFileLoading', current + 1, length)
            },

            () => {
                const current = mediaList.getIndexFromPath(files[0].path)
                const length = mediaList.getLength()
        
                mediaList.get(
                    mediaList.setCurrentIndex(current)
                )

                window.webContents.send('progressFileLoading', current + 1, length)
                window.webContents.send('endLoading')
            }
        )
    } catch (e) {
        log.error('file-open', 'load media in directory: e.error: ', e.message)
        log.error('file-open', 'load media in directory: e.stack: ', e.stack)
    }
}


