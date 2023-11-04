import { readFileSync } from "fs"
import path from "path"



const fontType = 'woff2'

const fontList = [
    {
        assistant: [
            {
                name: 'Assistant-ExtraLight',
                weight: '200',
            },
            {
                name: 'Assistant-Light',
                weight: '300',
            },
            {
                name: 'Assistant-Regular',
                weight: 'normal',
            },
            /*
            {
                name: 'Assistant-Medium',
                weight: '500',
            },    // not found font data
            */
            {
                name: 'Assistant-SemiBold',
                weight: '600',
            },
            {
                name: 'Assistant-Bold',
                weight: '700',
            },
            {
                name: 'Assistant-ExtraBold',
                weight: '800',
            },
        ]
    }
]

const fontTemplate = '  \
@font-face {  \
    font-family: "Assistant";  \
    font-style: normal;  \
    font-weight: {fontWeight};  \
    src: url(data:font/{fontType};base64,{b64}) format("{fontType}");  \
}  \
\
'

const convertTemplate = (font: string, fontWeight: string, b64: string) => {
    return fontTemplate
        .replace('{fontType}', fontType)
        .replace('{fontWeight}', fontWeight)
        .replace('{b64}', b64)
}



class Font {
    font_styles: string = ''

    constructor() {
        for (let fontFamilies of fontList) {
            Object.keys(fontFamilies).forEach(fontName => {
                const fontFamily = fontFamilies[fontName]
                fontFamily.forEach(font => {
                    const font_path = path.join(__dirname, `local-data/fonts/${fontName}/${font.name}.${fontType}`)
                    const binary = readFileSync(font_path)
                    const b64 = Buffer.from(binary).toString('base64')

                    this.font_styles += convertTemplate(font.name, font.weight, b64)
                })
            })
        }
    }
}



const font = new Font()
export default font


