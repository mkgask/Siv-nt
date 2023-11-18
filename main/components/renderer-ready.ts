import log from 'electron-log' 



class RendererReady {
    private _ready: Array<string> = []
    private _ready_end: number = 4

    setReady(ready_key: string) {
        if (this._ready_end <= this._ready.length) return
        if (this._ready.includes(ready_key)) return
        log.debug('rendererReady', 'call: RendererReady.setReady: : ', ready_key)
        this._ready.push(ready_key)
    }

    checkReady(): boolean {
        log.debug('rendererReady', 'call: RendererReady.checkReady: : ', this._ready.length, ' <= ', this._ready_end, ' : ', this._ready.length <= this._ready_end)
        return this._ready_end <= this._ready.length
    }

    CheckAndSetReady(ready_key: string): boolean {
        this.setReady(ready_key)
        return this.checkReady()
    }

    /*  for test
    */

    getReady(): Array<string> {
        return this._ready
    }

    getEnd(): number {
        return this._ready_end
    }

    setEnd(ready_end: number) {
        log.debug('rendererReady', 'call: RendererReady.setEnd: : ', ready_end)
        if (ready_end < 0) throw new Error('ready_end must be greater than or equal to 0')
        this._ready_end = ready_end
    }
}



const rendererReady = new RendererReady()
export default rendererReady

export {
    RendererReady
}


