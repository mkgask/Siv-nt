import { useEffect, useState } from "react"
import styled from '@emotion/styled'

const Theme = styled('div')(({ theme }) => {
    return {
    }
})



export default function FileInfo() {

    const [filePath, setFilePath] = useState(null)
    const [fileSize, setFileSize] = useState(null)
    const [sizeW, setSizeW] = useState(null)
    const [sizeH, setSizeH] = useState(null)

    useEffect(() => {
        const { ipcEvent } = window as any

        ipcEvent.onChangeFileInfo((media) => {
            console.log('Fileinfo: onChangeFileInfo: media: ', media)
            setFilePath(media.path)
            setFileSize(media.filesize)
            setSizeW(media.imagesize_w)
            setSizeH(media.imagesize_h)
        })
    }, [])

    return (
        <Theme className="file-info">
            <p className="filepath">{filePath}</p>
            <p className="filesize">{fileSize}</p>
            <p className="imagesize">{sizeW} x {sizeH}</p>
        </Theme>
    )
}
