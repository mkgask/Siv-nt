import Store from 'electron-store'
import yaml from 'js-yaml'

import { accepted_types } from './accepted-types'

import log from '../helpers/electron-log-wrapper'

import type { SettingsType } from '../../commonTypes/settings-type'

import env from './env'



const store = new Store<Settings>({
    name: env.isProd ? 'settings' : 'settings-dev',
    fileExtension: 'yml',
    serialize: yaml.dump,
    deserialize: yaml.load,
})



const settings_defaults: SettingsType = {
    display_info_enabled: false,
    accepted_types: accepted_types,
    image_move_ratio_x: 16,
    image_move_ratio_y: 16,
    move_inverse_x: false,
    move_inverse_y: false,
    zoom_change_ratio: 5,
    log_output: false,
    wheel_inverse: false,
}



class Settings implements SettingsType {
    display_info_enabled: boolean = settings_defaults.display_info_enabled
    accepted_types: object = settings_defaults.accepted_types
    image_move_ratio_x: number = settings_defaults.image_move_ratio_x
    image_move_ratio_y: number = settings_defaults.image_move_ratio_y
    move_inverse_x: boolean = settings_defaults.move_inverse_x
    move_inverse_y: boolean = settings_defaults.move_inverse_y
    zoom_change_ratio: number = settings_defaults.zoom_change_ratio
    log_output: boolean = settings_defaults.log_output
    wheel_inverse: boolean = settings_defaults.wheel_inverse

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
            throw new Error(`key '${key}' does not exist in Settings`)
        }

        this[key] = value
        log.debug('settings', 'call: Settings.save: : ', key, ' : ', value)

        store.set(key, value)
    }
}



const settings = new Settings
export default settings

export {
    store,
    settings_defaults,
    Settings,
}
