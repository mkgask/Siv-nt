import { useEffect, useState } from "react"
import styled from '@emotion/styled'
import { Typography } from "@mui/material"

import displayInfoStyle from './display-info.module.css'

const Theme = styled('div')(({ theme }) => {
    return {
    }
})



export default function DisplayInfo() {

    const [filePath, setFilePath] = useState(null)
    const [fileSize, setFileSize] = useState(null)
    const [sizeW, setSizeW] = useState(null)
    const [sizeH, setSizeH] = useState(null)

    const [zoomLevel, setZoomLevel] = useState(100)

    useEffect(() => {

        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        const onChangeFileInfo = (media) => {
            console.log('Fileinfo: onChangeFileInfo: media: ', media)
            setFilePath(media.path)
            setFileSize(media.filesize)
            setSizeW(media.imagesize_w)
            setSizeH(media.imagesize_h)
        }

        const onChangeZoomLevel = (zoomLevel) => {
            console.log('Fileinfo: onChangeZoomLevel: zoomLevel: ', zoomLevel)
            setZoomLevel(zoomLevel)
        }

        ipcEvent.onChangeFileInfo(onChangeFileInfo)
        ipcEvent.onChangeZoomLevel(onChangeZoomLevel)

        ipcSend.readyFileInfo()

        return () => {
            ipcEvent.off('onChangeFileInfo', onChangeFileInfo)
            ipcEvent.off('onChangeZoomLevel', onChangeZoomLevel)
        }
    }, [])

    return (
        <Theme className={displayInfoStyle.fileInfo}>
            {filePath ? (
                <>
                    <Typography className={displayInfoStyle.filePath}>{filePath}</Typography>
                    <Typography className={displayInfoStyle.fileSize}>{fileSize}</Typography>
                    <Typography className={displayInfoStyle.imageSize}>{`${(sizeW || sizeH) ? (sizeW + ' x ' + sizeH) : ''}`}</Typography>
                    <Typography className={displayInfoStyle.zoomLevel}>{`${zoomLevel.toFixed(2)}`}%</Typography>
                </>
            ) : (
                <Typography className="no-file">Display file information here if file selected</Typography>
            )}
        </Theme>
    )
}
