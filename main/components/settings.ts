import Store from 'electron-store'
import yaml from 'js-yaml'

import { accepted_types } from './accepted-types'

import log from '../helpers/electron-log-wrapper'



const store = new Store<Settings>({
    name: 'settings',
    fileExtension: 'yml',
    serialize: yaml.dump,
    deserialize: yaml.load,
})



type SettingsType = {
    display_info_enabled: boolean,
    accepted_types: object,
    image_move_ratio: number,
    zoom_change_ratio: number,
    log_output: boolean,
}

const settings_defaults: SettingsType = {
    display_info_enabled: false,
    accepted_types: accepted_types,
    image_move_ratio: 16,
    zoom_change_ratio: 5,
    log_output: false,
}



class Settings {
    display_info_enabled: boolean = settings_defaults.display_info_enabled
    accepted_types: object = settings_defaults.accepted_types
    image_move_ratio: number = settings_defaults.image_move_ratio
    zoom_change_ratio: number = settings_defaults.zoom_change_ratio
    log_output: boolean = false

    constructor() {
        this.load()
    }

    load() {
        for (let key in settings_defaults) {
            // store.getした値をthisにセットする
            this[key] = store.get(key, settings_defaults[key])
        }
    }

    save_all() {
        for (let key in settings_defaults) {
            store.set(key, this[key])
        }
    }

    save(key, value) {
        // keyが存在しない場合は例外エラー
        if (!key || this.hasOwnProperty(key) === false) {
            throw new Error(`key '${key}' is not exists in Settings`)
        }

        this[key] = value
        log.debug('settings', 'call: Settings.save: : ', key, ' : ', value)

        store.set(key, value)
    }
}



const settings = new Settings
export default settings


