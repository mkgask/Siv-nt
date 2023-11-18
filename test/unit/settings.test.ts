import { Settings, settings_defaults, store } from '../../main/components/settings';



describe('Settings', () => {
    let settings: Settings;

    beforeEach(() => {
        settings = new Settings();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('load', () => {
        it('should load settings from store', () => {
            const store_get = jest.spyOn(store, 'get')
            store_get.mockImplementation((key) => settings_defaults[key])

            settings.load();

            let count = 0

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                expect(settings[key]).toEqual(settings_defaults[key])
                count += 1
            }

            expect(store_get).toHaveBeenCalledTimes(count)
        });
    });

    describe('save_all', () => {
        it('should save all settings to store', () => {
            const testExpected = {}
            const testActual = {}
            const store_set = jest.spyOn(store, 'set') as any    // store.setの型定義が複数あり、Jestが認識できないためanyで回避
            store_set.mockImplementation((key, value) => { testActual[key] = value; return; })

            function for_test(any: any) {
                if (typeof any === 'undefined')
                    return true

                if (typeof any === 'boolean')
                    return !any

                if (typeof any === 'string')
                    return any + '_test_string'

                if (typeof any === 'number')
                    return any * -1

                if (Array.isArray(any)) {
                    any.push('test')
                    return any
                }

                if (Object.prototype.toString.call(any) === '[object Object]') {
                    if (any.constructor.name === 'BigInt')
                        return any * -1
                    return any['test'] = 'test'
                }

                return any
            }

            let count = 0

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                testExpected[key] = for_test(settings[key])
                settings[key] = testExpected[key]
                count += 1
            }

            settings.save_all();

            expect(store_set).toHaveBeenCalledTimes(count)
            
            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                expect(testActual[key]).toEqual(testExpected[key])
            }
        });
    });

    describe('save', () => {
        it('should save the specified key-value pair to store', () => {
            const testExpected = {}
            const testActual = {}
            const store_set = jest.spyOn(store, 'set') as any    // store.setの型定義が複数あり、Jestが認識できないためanyで回避
            store_set.mockImplementation((key, value) => { testActual[key] = value; return; })

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                testExpected[key] = settings[key]
                testActual[key] = settings[key]
            }

            const key = 'display_info_enabled'
            const value = !settings.display_info_enabled
            testExpected[key] = value

            settings.save(key, value);

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                expect(testActual[key]).toEqual(testExpected[key])
            }
        });

        it('should throw an error if the key does not exist', () => {
            const testExpected = {}
            const testActual = {}
            const store_set = jest.spyOn(store, 'set') as any    // store.setの型定義が複数あり、Jestが認識できないためanyで回避
            store_set.mockImplementation((key, value) => { testActual[key] = value; return; })

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                testExpected[key] = settings[key]
                testActual[key] = settings[key]
            }

            const key = 'invalid_key'
            const value = false

            expect(() => {
                settings.save(key, value);
            }).toThrow(`key '${key}' does not exist in Settings`);

            expect(store_set).not.toHaveBeenCalled();

            for (const key in settings) {
                if (typeof settings[key] === 'function') continue
                expect(testActual[key]).toEqual(testExpected[key])
            }
        });
    });
});