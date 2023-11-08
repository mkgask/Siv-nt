import fs from "fs"

import mime from 'mime-lite'

import log from "../helpers/electron-log-wrapper"

import { is_accepted, get_media_type } from './accepted-types'
import Media from "./media"

import env from "./env"



// オブジェクトのキーをPHPの連想配列のように自由に追加できるようにする
interface mutableProps {
    [props: string]: any
}

const dirSeparator = env.platform === 'win32' ? '\\' : '/'



class MediaList {

    /*  Properties
    */

    list: mutableProps = {}
    length: number = 0
    timeOrder: Array<string> = []
    nameOrder: Array<string> = []
    current: number = 0
    orderby: 'time' | 'name' = 'name'
    order: 'asc' | 'desc' = 'asc'



    /*  Foundation
    */

    constructor(files: Array<Media> = []) {
        log.debug('media-list', 'call: MediaList.constructor')

        if (files) this.changeList(files)
    }



    /*  Modules List
    */

    changeList(files: Array<Media>): void {
        log.debug('media-list', 'call: MediaList.changeList')
        log.debug('media-list', 'call: MediaList.changeList: files: ', files)

        if (!files || !Array.isArray(files)) return

        if (files.length === 1) {
            // ファイルを一枚だけドロップされた時は、同じディレクトリのファイルを収集してセット

            // パスからディレクトリを取得
            const dir = files[0].path.replace(/^(.+)[\/\\][^\/\\]+$/, '$1')
            log.debug('media-list', 'call: MediaList.changeList: dir: ', dir)

            // ディレクトリ名からファイルリストを取得
            const _files = fs.readdirSync(dir)
            log.debug('media-list', 'call: MediaList.changeList: _files: ', _files)

            // ファイルを一個一個確認
            let _files2 = []

            _files.map((file) => {
                const path = dir + dirSeparator + file
                const mime_type = mime.getType(path)
                if (!is_accepted(mime_type)) return null

                const type = get_media_type(mime_type)

                _files2.push({
                    path: path,
                    mime_type: mime_type,
                    type: type,
                })
            })

            log.debug('media-list', 'call: MediaList.changeList: _files2: ', _files2)
            this.setList(_files2)
        } else {
            // ファイルを複数枚ドロップされた時は、ドロップされたファイル群をセット
            this.setList(files)
        }

        this.createTimeOrder()
        this.createNameOrder()
    }

    setList(files: Array<Media>): void {
        log.debug('media-list', 'call: MediaList.setList: files: ', files)

        if (!files ||
            !Array.isArray(files) ||
            files.length === 0
        ) return

        this.list = {}
        this.length = 0

        for (const file of files) {
            const media = file.hasOwnProperty('filesize') ?
                new Media(
                    file.path,
                    file.mime_type,
                    file.type,
                    0,
                    file.filesize,
                ) :
                new Media(
                    file.path,
                    file.mime_type,
                    file.type,
                )

            this.list[media.path] = media
            this.length += 1
        }

        log.debug('media-list', 'call: MediaList.setList: this.list: ', this.list)
    }

    createTimeOrder(): void {
        log.debug('media-list', 'call: MediaList.createTimeOrder')

        this.timeOrder = Object.keys(this.list).sort((a, b) => {
            return this.list[a].time - this.list[b].time
        })
    }

    createNameOrder(): void {
        log.debug('media-list', 'call: MediaList.createNameOrder')

        this.nameOrder = Object.keys(this.list).sort((a, b) => {
            if (this.list[a].path < this.list[b].path) return -1
            if (this.list[a].path > this.list[b].path) return 1
            return 0
        })
    }



    /*  Modules  index
    */

    setCurrentIndex(index: number): number {
        log.debug('media-list', 'call: MediaList.setCurrent: index: ', index)

        if (this.length < 1) return -1
        if (index < 0) return -1
        if (this.length <= index) return -1

        return this.current = index
    }

    getIndexFromPath(path: string): number {
        log.debug('media-list', 'call: MediaList.getCurrentFromPath: path: ', path)

        if (this.length < 1) return -1
        if (!path) return -1
        if (!this.list.hasOwnProperty(path)) return -1

        if (this.orderby === 'time') {
            return this.timeOrder.indexOf(path)
        }

        if (this.orderby === 'name') {
            return this.nameOrder.indexOf(path)
        }

        return 0
    }

    /*  Modules  get
    */

    getFromPath(path: string): Media {
        log.debug('media-list', 'call: MediaList.getFromPath: path: ', path)

        if (this.length < 1) return new Media()
        if (!path) return new Media()
        if (!this.list.hasOwnProperty(path)) return new Media()

        return this.list[path]
    }

    get(index: number): Media {
        log.debug('media-list', 'call: MediaList.get: index: ', index)

        if (this.length < 1) return new Media()
        if (index < 0) return new Media()
        if (this.length <= index) return new Media()

        if (this.orderby === 'time') {
            const path = this.timeOrder[index]
            return this.list[path]
        }

        if (this.orderby === 'name') {
            const path = this.nameOrder[index]
            return this.list[path]
        }

        // オブジェクトのプロパティの最初の一個を返す
        const firstKey = Object.keys(this.list)[0]
        return this.list[firstKey]
    }

    getCurrent(): Media {
        log.debug('media-list', 'call: MediaList.getCurrent')

        return this.get(this.current)
    }

    getAsc(): Media {
        log.debug('media-list', 'call: MediaList.getAsc')
        log.debug('media-list', 'call: MediaList.getAsc: this.length: ', this.length)

        if (this.current + 1 < this.length) {
            this.current += 1
        } else {
            this.current = 0
        }

        return this.get(this.current)
    }

    getDesc(): Media {
        log.debug('media-list', 'call: MediaList.getDesc')
        log.debug('media-list', 'call: MediaList.getDesc: this.length: ', this.length)

        if (0 < this.current) {
            this.current -= 1
        } else {
            this.current = this.length - 1
        }

        return this.get(this.current)
    }

    getNext(): Media {
        log.debug('media-list', 'call: MediaList.getNext')

        if (this.order === 'asc') return this.getAsc()
        if (this.order === 'desc') return this.getDesc()
        return this.get(0)
    }

    getPrev(): Media {
        log.debug('media-list', 'call: MediaList.getPrev')

        if (this.order === 'asc') return this.getDesc()
        if (this.order === 'desc') return this.getAsc()
        return this.get(0)
    }
}



const mediaList = new MediaList()
export default mediaList


