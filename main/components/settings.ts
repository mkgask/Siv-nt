import Store from 'electron-store'
import log from 'electron-log'
import yaml from 'js-yaml'

import accepted_types from './accepted-types'



const store = new Store<Settings>({
    name: 'settings',
    fileExtension: 'yml',
    serialize: yaml.dump,
    deserialize: yaml.load,
})



const settings_defaults = {
    display_info_enabled: false,
    accepted_types: accepted_types,
    image_move_ratio: 16,
    log_output: false,
}



class Settings {
    display_info_enabled: boolean = settings_defaults.display_info_enabled
    accepted_types: object = settings_defaults.accepted_types
    image_move_ratio: number = settings_defaults.image_move_ratio
    log_output: boolean = false

    constructor() {
        this.load()
    }

    load() {
        this.display_info_enabled = store.get('display_info_enabled', settings_defaults.display_info_enabled)
        this.accepted_types = store.get('accepted_types', settings_defaults.accepted_types)
        this.image_move_ratio = store.get('image_move_ratio', settings_defaults.image_move_ratio)
    }

    save_all() {
        store.set('display_info_enabled', this.display_info_enabled)
        store.set('accepted_types', this.accepted_types)
        store.set('image_move_ratio', this.image_move_ratio)
    }

    save(key, value) {
        // keyが存在しない場合は例外エラー
        if (!key || this.hasOwnProperty(key) === false) {
            throw new Error(`key '${key}' is not exists in Settings`)
        }

        log.debug('call: Settings.save: key : value', key, ' : ', value)

        store.set(key, value)
    }
}



const settings = new Settings
export default settings


