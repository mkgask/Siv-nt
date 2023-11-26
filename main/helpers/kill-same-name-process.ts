import { exec } from 'child_process'

import env from '../components/env'


/*  以前のデバッグのプロセスが残っていたら全削除する（自分はキルしない）
*/
export default function killSameNameProcess() {
    exec(`tasklist /FI "IMAGENAME eq ${env.name}.exe" /NH`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            return
        }

        const self_pid = process.pid.toString()

        const processes = stdout.split('\r\n')
            .filter(line => line.includes(env.name) && !line.includes(self_pid))
            .map(line => line.trim().split(/\s+/))
            .map(fields => fields[1])

        processes.forEach(pid => {
            // 自分はキルしない
            if (pid === self_pid) return

            exec(`taskkill /F /PID ${pid}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error killing process ${pid}:`, err)
                } else {
                    console.log(`Process ${pid} killed successfully.`)
                }
            })
        })
    })
}


