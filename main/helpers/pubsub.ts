import EventEmitter from "events";

import log from './electron-log-wrapper'
import mutableProps from "./mutable-props"



const pubsubTopics = {
    startGenerateFileList: 'StartGenerateFileList',
    endGenerateFileList: 'EndGenerateFileList',
    startCanceledGenerateFileList: 'StartCanceledGenerateFileList',
    endCancelGenerateFileList: 'EndCancelGenerateFileList',
}



class PubSub extends EventEmitter {

    /*  Properties
    */

    topics = pubsubTopics

    private _publish_count: mutableProps = {}



    /*  Foundation
    */

    constructor() {
        super()
    }



    Publish(topic, data = null) {
        log.debug('pubsub', 'call: PubSub.Publish: topic: ', topic, ' : data: ', data)

        if (topic === this.topics.startGenerateFileList) { this._fileListGenerating = true }
        if (topic === this.topics.endGenerateFileList) { this._fileListGenerating = false }

        if (topic === this.topics.startCanceledGenerateFileList) { this._canceledGenerateFileList = true }
        if (topic === this.topics.endCancelGenerateFileList) { this._canceledGenerateFileList = false }

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

    fields = {
        fileListGenerating: 'fileListGenerating',
        canceledGenerateFileList: 'canceledGenerateFileList',
        startQuit: 'startQuit',
    }

    private _fileListGenerating: boolean = false
    private _canceledGenerateFileList: boolean = false
    private _startQuit: boolean = false

    getSpecialField(key: string) {
        key = '_' + key

        log.debug('pubsub', 'call: PubSub.getSpecialField: key: ', key)

        if (this.hasOwnProperty(key) === false)
            throw new Error(`key '${key}' does not exist in PubSub`)

        if (typeof this[key] === 'function')
            throw new Error(`key '${key}' is function in PubSub`)

        log.debug('pubsub', 'call: PubSub.getSpecialField: ', key, ' : ', this[key])

        return this[key]
    }
}



const pubsub = new PubSub()
export default pubsub


