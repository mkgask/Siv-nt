import { _electron } from 'playwright'

import { test } from '@playwright/test'

export default async function testBoot() {

    test('boot test', async () => {

        // Electronアプリのパスを指定します
        const electronAppPath = 'app/background.js'

        // Electronアプリをヘッドレスモードで起動します
        const electronApp = await _electron.launch({
            args: [electronAppPath],
        })

        // 新しいウィンドウが開くのを待ちます
        const window = await electronApp.firstWindow()

        // ウィンドウが表示されることを確認します
        //await window.waitForLoadState('domcontentloaded')

        // アプリを終了します
        await electronApp.close()
    })

}