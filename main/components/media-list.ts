import fs from "fs"

import mime from 'mime-lite'

import log from "../helpers/electron-log-wrapper"

import { is_accepted, get_media_type } from './accepted-types'
import Media from "./media"

import env from "./env"
import { create } from "domain"



// オブジェクトのキーをPHPの連想配列のように自由に追加できるようにする
interface mutableProps {
    [props: string]: any
}

const dirSeparator = env.platform === 'win32' ? '\\' : '/'



class MediaList {

    /*  Properties
    */

    private list: mutableProps = {}
    private length: number = 0
    private timeOrder: Array<string> = []
    private nameOrder: Array<string> = []
    private current: number = 0
    private orderby: 'time' | 'name' = 'name'
    private order: 'asc' | 'desc' = 'asc'



    /*  Foundation
    */

    constructor(files: Array<Media> = []) {
        log.debug('media-list', 'call: MediaList.constructor')

        if (0 < files.length) this.changeList(files)
    }



    /*  Modules List
    */

    changeList(files: Array<Media>, progress_callback = (current, length) => {}, end_callback = () => {}): void {
        log.debug('media-list', 'call: MediaList.changeList')
        log.debug('media-list', 'call: MediaList.changeList: files: ', files)

        if (!files || !Array.isArray(files)) return

        // パスからディレクトリを取得
        const dir = files[0].path.replace(/^(.+)[\/\\][^\/\\]+$/, '$1')
        log.debug('media-list', 'call: MediaList.changeList: dir: ', dir)

        // ディレクトリ名からファイルリストを取得
        const _files = fs.readdirSync(dir)
        log.debug('media-list', 'call: MediaList.changeList: _files: ', _files)

        // ファイルを一個一個確認
        const self = this
        this.list = {}
        this.length = 0

        const generateFileList = (file: Array<string>, current: number) => {
            log.debug('media-list', 'call: MediaList.changeList: generateFileList: current: ', current)

            if (file.length <= current) {
                self.createTimeOrder()
                self.createNameOrder()
                end_callback()
                return
            }

            const path = dir + dirSeparator + file[current]
            const mime_type = mime.getType(path)

            if (is_accepted(mime_type)) {
                const type = get_media_type(mime_type)

                self.list[path] = {
                    path: path,
                    mime_type: mime_type,
                    type: type,
                }

                self.length += 1
            }

            progress_callback(current, _files.length)

            setTimeout(() => {
                generateFileList(file, current + 1)
            }, 0)
        }

        generateFileList(_files, 0)
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



    /*  Modules  Media
    */

    getOrCreateMediaFromPath(path: string): Media {
        log.debug('media-list', 'call: MediaList.createMediaFromPath: path: ', path)

        if (!path) return new Media()

        log.debug('media-list', 'call: MediaList.createMediaFromPath: isMedia: ', (
            this.list.hasOwnProperty(path) &&
            this.list[path].constructor.name === 'Media'
        ))

        // 既にMediaを持っている
        if (this.list.hasOwnProperty(path) &&
            this.list[path].constructor.name === 'Media'
        ) {
            return this.list[path]
        }

        log.debug('media-list', 'call: MediaList.createMediaFromPath: isHave: ', this.list.hasOwnProperty(path))

        // Mediaになる前のオブジェクトを持っている
        if (this.list.hasOwnProperty(path)) {
            this.list[path] = new Media(
                this.list[path].path,
                this.list[path].mime_type,
                this.list[path].type,
            )
    
            return this.list[path]
        }

        log.debug('media-list', 'call: MediaList.createMediaFromPath: create')

        // 持ってなかったらMediaにして追加
        const mime_type = mime.getType(path)
        const type = get_media_type(mime_type)
        if (!type) return new Media()

        this.list[path] = new Media(
            path,
            mime_type,
            type,
        )

        this.length += 1

        return this.list[path]
    }



    /*  Modules  index
    */

    getLength(): number {
        log.debug('media-list', 'call: MediaList.getLength')
        return this.length
    }

    getCurrentIndex(): number {
        log.debug('media-list', 'call: MediaList.getCurrentIndex')
        return this.current
    }

    setCurrentIndex(index: number): number {
        log.debug('media-list', 'call: MediaList.setCurrent: index: ', index)

        if (this.length < 1) return -1
        if (index < 0) return -1
        if (this.length <= index) return -1

        return this.current = index
    }

    getIndexFromPath(path: string): number {
        log.debug('media-list', 'call: MediaList.getIndexFromPath: path: ', path)

        if (this.length < 1) return -1
        if (!path) return -1
        if (!this.list.hasOwnProperty(path)) return -1

        if (this.orderby === 'time') {
            const index = this.timeOrder.indexOf(path)
            log.debug('media-list', 'call: MediaList.getIndexFromPath: time order index: ', index)
            return index
        }

        if (this.orderby === 'name') {
            const index = this.nameOrder.indexOf(path)
            log.debug('media-list', 'call: MediaList.getIndexFromPath: this.nameOrder: ', this.nameOrder)
            log.debug('media-list', 'call: MediaList.getIndexFromPath: name order index: ', index)
            return index
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
            const media = this.getOrCreateMediaFromPath(path)
            return media
        }

        if (this.orderby === 'name') {
            const path = this.nameOrder[index]
            const media = this.getOrCreateMediaFromPath(path)
            return media
        }

        // オブジェクトのプロパティの最初の一個を返す
        const firstKey = Object.keys(this.list)[0]
        const media = this.getOrCreateMediaFromPath(firstKey)
        return media
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


