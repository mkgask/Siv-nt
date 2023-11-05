import { readFileSync } from "fs"
import path from "path"



const imageList = [
    {
        name: 'next-button',
        path: path.join(__dirname, 'local-data/images/next-button.svg'),
    },
    {
        name: 'prev-button',
        path: path.join(__dirname, 'local-data/images/prev-button.svg'),
    }
]



class ImageList {
    images: { [key: string]: string } = {}

    constructor() {
        /*
        imageList.forEach(image => {
            const binary = readFileSync(image.path)
            const b64 = Buffer.from(binary).toString('base64')

            this.images[image.name] = b64
        })
        */
    }
}



const image_list = new ImageList()
export default image_list.images


