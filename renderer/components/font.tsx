import { useEffect, useState } from "react"


export default function Font() {

    const [font_styles, setFontStyles] = useState()

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onEnv = (env) => {
            console.log('Font: onEnv: env.font_styles: ', env.font_styles)
            setFontStyles(env.font_styles)
        }

        ipcEvent.onEnv(onEnv)

        return () => {
            ipcEvent.off('onEnv', onEnv)
        }
    }, [])

    return (
        <style>
            {font_styles}
        </style>
    )
}


