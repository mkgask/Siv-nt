import { ipcMain } from "electron";



export const registerIpc = () => {

    ipcMain.handle('get-secrets', (e) => {
        if (!validateSender(e.senderFrame)) return null
        return getSecrets()
    })

    function validateSender(frame) {
        // 既存の URL パーサと allowlist を使用して URL のホストを評価します
        const url = new URL(frame.url);
        if (url.host === 'localhost' || url.protocol === 'file:') return true;
        return false;
    }

    function getSecrets()
    {

    }
}


