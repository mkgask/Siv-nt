import { statSync, existsSync, readFileSync } from 'fs'

import mime from 'mime-lite'
import sizeOf from 'image-size'

import { get_media_type } from './accepted-types'

import log from '../helpers/electron-log-wrapper'



const calculateDisplayFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
    return display_size
}



export default class Media {
    path: string = ''
    mime_type: string = ''
    type: string = ''
    time?: number = 0
    filesize?: string = ''
    imagesize_w?: number = -1
    imagesize_h?: number = -1
    b64?: string = ''

    constructor(
        path: string = '',
        mime_type: string = '',
        type: string = '',
        time: number = 0,
        filesize: string = '',
        imagesize_w: number = -1,
        imagesize_h: number = -1,
        b64: string = ''
    ) {
        log.debug('media', 'call: Media.constructor')
        log.debug('media', 'Media.path: ', path)
        log.debug('media', 'Media.mime_type: ', mime_type)
        log.debug('media', 'Media.type: ', type)
        log.debug('media', 'Media.time: ', time)
        log.debug('media', 'Media.filesize: ', filesize)
        log.debug('media', 'Media.imagesize_h: ', imagesize_h)
        log.debug('media', 'Media.imagesize_w: ', imagesize_w)

        this.reset(
            path,
            mime_type,
            type,
            time,
            filesize,
            imagesize_w,
            imagesize_h,
            b64
        )
    }

    get dataURI() { return `data:${this.mime_type};base64,${this.b64}` }

    reset(
        path: string = '',
        mime_type: string = '',
        type: string = '',
        time: number = 0,
        filesize: string = '',
        imagesize_w: number = -1,
        imagesize_h: number = -1,
        b64: string = ''
    ) {
        log.debug('media', 'call: Media.reset')

        // pathにファイルが存在しない場合は処理しない
        if (!existsSync(path)) {
            log.debug('media', 'call: Media.reset: path is not exists')
            return
        }

        this.generateDefaultInfo(
            path,
            mime_type,
            type,
            time,
            filesize,
            imagesize_w,
            imagesize_h,
        )

        if (b64 && !this.b64) {
            this.b64 = b64
        }
    }

    generateDefaultInfo(
        path: string = '',
        mime_type: string = '',
        type: string = '',
        time: number = 0,
        filesize: string = '',
        imagesize_w: number = -1,
        imagesize_h: number = -1,
    ) {
        if (!path) {
            if (!this.path) throw new Error('Media.generateDefaultInfo: path is not exists')
            path = this.path
        } else {
            this.path = path
        }

        // mime_typeが未取得の場合は、pathからtypeを取得する
        if (!mime_type) {
            try {
                this.mime_type = mime.getType(path)
            } catch (e) {
                this.mime_type = ''
                log.error('media', 'Media.generateDefaultInfo(): mime.getType(path): !!! error: ', path, ' : ', e.message)
                log.error('media', 'Media.generateDefaultInfo(): mime.getType(path): !!! error.stack: ', e.stack)
            }

            log.debug('media', 'Media.generateDefaultInfo(): mime.getType(path): path: ', path)
            log.debug('media', 'Media.generateDefaultInfo(): mime.getType(path): this.mime_type: ', this.mime_type)
        } else {
            this.mime_type = mime_type
        }

        // typeが未取得の場合は、mime_typeからメディアタイプを取得する
        if (!type) {
            this.type = get_media_type(this.mime_type) ?? ''
            log.debug('media', 'Media.generateDefaultInfo(): get_media_type(this.mime_type): this.mime_type: ', this.mime_type)
            log.debug('media', 'Media.generateDefaultInfo(): get_media_type(this.mime_type): this.type: ', this.type)
        } else {
            this.type = type
        }

        // timeが未取得の場合は、pathからtimeを取得する
        if (!time) {
            try {
                this.time = statSync(path).mtimeMs
            } catch (e) {
                this.time = 0
                log.error('media', 'Media.generateDefaultInfo(): statSync(path).mtimeMs: !!! error: ', path, ' : ', e.message)
                log.error('media', 'Media.generateDefaultInfo(): statSync(path).mtimeMs: !!! error.stack: ', e.stack)
            }

            log.debug('media', 'Media.generateDefaultInfo(): statSync(path).mtimeMs: path: ', path)
            log.debug('media', 'Media.generateDefaultInfo(): statSync(path).mtimeMs: this.time: ', this.time)
        } else [
            this.time = time
        ]

        // filesizeが未取得の場合は、pathからfilesizeを取得する
        if (!filesize) {
            try {
                this.filesize = calculateDisplayFileSize(statSync(path).size)
            } catch (e) {
                this.filesize = ''
                log.error('media', 'Media.generateDefaultInfo(): calculateDisplayFileSize(statSync(path).size): !!! error: ', path, ' : ', e.message)
                log.error('media', 'Media.generateDefaultInfo(): calculateDisplayFileSize(statSync(path).size): !!! error.stack: ', e.stack)
            }

            log.debug('media', 'Media.generateDefaultInfo(): calculateDisplayFileSize(statSync(path).size): path: ', path)
            log.debug('media', 'Media.generateDefaultInfo(): calculateDisplayFileSize(statSync(path).size): this.filesize: ', this.filesize)
        } else {
            this.filesize = filesize
        }

        // imagesizeが未取得の場合は、pathからimagesizeを取得する
        if (imagesize_w === -1 || imagesize_h === -1) {
            try {
                const dimensions = sizeOf(path)
                this.imagesize_w = dimensions.width
                this.imagesize_h = dimensions.height
            } catch (e) {
                this.imagesize_w = -1
                this.imagesize_h = -1
                log.error('media', 'Media.generateDefaultInfo(): sizeOf(path): !!! error: ', path, ' : ', e.message)
                log.error('media', 'Media.generateDefaultInfo(): sizeOf(path): !!! error.stack: ', e.stack)
            }

            log.debug('media', 'Media.generateDefaultInfo(): const dimensions = sizeOf(path): w x h : ', this.imagesize_w, ' : ', this.imagesize_h)
        } else {
            this.imagesize_w = imagesize_w
            this.imagesize_h = imagesize_h
        }
    }

    generateViewerInfo(
        path: string = '',
        b64: string = '',
    ) {
        if (!path) {
            if (!this.path) return
            path = this.path
        }

        if (!path) { throw new Error('Media.generateViewerInfo: path is not exists')}

        // Base64データが未取得の場合は、pathからBase64データを取得する
        if (b64 === '') {
            // pathからファイルの内容を取得する
            const binary = readFileSync(path)
            this.b64 = Buffer.from(binary).toString('base64')
            log.debug('media', 'Media.generateViewerInfo(): create base64: ', !!this.b64)
        }
    }
}


