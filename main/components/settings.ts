import Store from 'electron-store'
import log from 'electron-log'
import yaml from 'js-yaml'



const store = new Store<Settings>({
    name: 'settings',
    fileExtension: 'yml',
    serialize: yaml.dump,
    deserialize: yaml.load,
})



export default class Settings {
    display_info_enabled: boolean = false

    constructor() {
        this.load()
    }

    load() {
        this.display_info_enabled = store.get('display_info_enabled', false)
    }

    save_all() {
        store.set('display_info_enabled', this.display_info_enabled)
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