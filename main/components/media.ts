import { statSync, existsSync, readFileSync } from 'fs'

import mime from 'mime-lite'
import sizeOf from 'image-size'


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



const calculateDisplayFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
    return display_size
}



export default class Media {
    path: string
    b64: string
    type: string
    mime_type: string
    filesize: string
    imagesize_w: number
    imagesize_h: number

    constructor(path: string = '', b64: string = '', type: string = '', mime_type: string = '', filesize: string = '', imagesize_w: number = -1, imagesize_h: number = -1) {
        this.reset(path, b64, type, mime_type, filesize, imagesize_w, imagesize_h)
    }

    get dataURI() { return `data:${this.mime_type};base64,${this.b64}` }

    reset(path: string = '', b64: string = '', type: string = '', mime_type: string = '', filesize: string = '', imagesize_w: number = -1, imagesize_h: number = -1) {
        console.log('call: Media.reset')

        // pathにファイルが存在しない場合は処理しない
        if (!existsSync(path)) {
            console.log('call: Media.reset: path is not exists')
            return
        }

        this.path = path
        this.b64 = b64
        this.type = type
        this.mime_type = mime_type
        this.filesize = filesize
        this.imagesize_w = imagesize_w
        this.imagesize_h = imagesize_h

        // mime_typeが未取得の場合は、pathからtypeを取得する
        if (mime_type === '') {
            this.mime_type = mime.getType(path)
        }

        // typeが未取得の場合は、mime_typeからメディアタイプを取得する
        if (type === '') {
            this.type = accepted_types[this.mime_type]
        }

        // Base64データが未取得の場合は、pathからBase64データを取得する
        if (b64 === '') {
            // pathからファイルの内容を取得する
            const data = readFileSync(path)
            this.b64 = Buffer.from(data).toString('base64')
        }

        // filesizeが未取得の場合は、pathからfilesizeを取得する
        if (!filesize) {
            this.filesize = calculateDisplayFileSize(statSync(path).size)
        }

        // imagesizeが未取得の場合は、pathからimagesizeを取得する
        if (imagesize_w === -1 || imagesize_h === -1) {
            const dimensions = sizeOf(path)
            this.imagesize_w = dimensions.width
            this.imagesize_h = dimensions.height
        }
    }
}


