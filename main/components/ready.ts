import log from 'electron-log' 



let ready = []
const ready_end = 4

export default function readyCheck (receive: string) {
    if (ready_end <= ready.length) return false
    if (ready.includes(receive)) return false

    ready.push(receive)

    log.debug('view', 'readyCheck: receive: ', receive)
    return ready_end <= ready.length
}


