import { BrotliOptions } from "zlib"



class Env {
    readonly isProd: boolean = process.env.NODE_ENV === 'production'
    readonly isDev: boolean = !this.isProd
}



const env = new Env()
export default env


