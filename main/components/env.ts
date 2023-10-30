import packageJson from '../../package.json'



class Env {
    readonly name: string = packageJson.name
    readonly description: string = packageJson.description
    readonly version: string = packageJson.version
    readonly author: string = packageJson.author
    readonly homepage: string = packageJson.homepage

    readonly isProd: boolean = process.env.NODE_ENV === 'production'
    readonly isDev: boolean = !this.isProd
}



const env = new Env()
export default env


