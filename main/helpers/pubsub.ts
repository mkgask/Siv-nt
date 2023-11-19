import EventEmitter from "events";

import log from './electron-log-wrapper'
import mutableProps from "./mutable-props"



class PubSub extends EventEmitter {

    /*  Properties
    */

    private _publish_count: mutableProps = {}



    /*  Foundation
    */

    constructor() {
        super()
    }



    Publish(topic, data) {
        log.debug('pubsub', 'call: PubSub.Publish: topic: ', topic, ' : data: ', data)

        if (topic === 'StartGenerateFileList') { this._fileListGenerating = true }
        if (topic === 'EndGenerateFileList') { this._fileListGenerating = false }

        if (topic === 'StartCancelGenerateFileList') { this._canceledGenerateFileList = true }
        if (topic === 'EndCancelGenerateFileList') { this._canceledGenerateFileList = false }

        this._publish_count[topic] = this._publish_count[topic] ? this._publish_count[topic] + 1 : 1

        this.emit(topic, data)
    }

    PublishOnlyFirst(topic, data) {
        log.debug('pubsub', 'call: PubSub.PublishOnlyFirst: topic: ', topic, ' : data: ', data)

        if (0 < this._publish_count[topic]) { return }
        this._publish_count[topic] = this._publish_count[topic] ? this._publish_count[topic] + 1 : 1

        this.emit(topic, data)
    }

    Subscribe(topic, callback) {
        log.debug('pubsub', 'call: PubSub.Subscribe: topic: ', topic)

        if (typeof callback !== 'function') {
            throw new Error('callback is not a function')
        }

        this.on(topic, callback)
    }

    SubscribeOnlyFirst(topic, callback) {
        log.debug('pubsub', 'call: PubSub.SubscribeOnlyFirst: topic: ', topic)

        if (typeof callback !== 'function') {
            throw new Error('callback is not a function')
        }

        if (0 < this.listenerCount(topic)) { return }

        this.on(topic, callback)
    }



    /*  Modules  special fields
    */

    private _fileListGenerating: boolean = false
    private _canceledGenerateFileList: boolean = false

    getSpecialField(key: string) {
        key = '_' + key

        if (this.hasOwnProperty(key) === false)
            throw new Error(`key '${key}' does not exist in PubSub`)

        if (typeof this[key] === 'function')
            throw new Error(`key '${key}' is function in PubSub`)

        return this[key]
    }
}



const pubsub = new PubSub()
export default pubsub


