import { useEffect, useState } from "react"
import styled from '@emotion/styled'
import { Box, Typography } from "@mui/material"

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
    const [current, setCurrent] = useState(null)
    const [max, setMax] = useState(null)

    const [zoomLevel, setZoomLevel] = useState(100)

    useEffect(() => {

        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        const onChangeDisplayInfo = (media) => {
            console.log('DisplayInfo: onChangeDisplayInfo: media: ', media)
            setFilePath(media.path)
            setFileSize(media.filesize)
            setSizeW(media.imagesize_w)
            setSizeH(media.imagesize_h)
        }

        const onChangeZoomLevel = (zoomLevel) => {
            console.log('DisplayInfo: onChangeZoomLevel: zoomLevel: ', zoomLevel)
            setZoomLevel(zoomLevel)
        }

        const onProgressFileLoading = (current, max) => {
            console.log('DisplayInfo: onProgress: progress: ', current, ' / ', max)
            setCurrent(current)
            setMax(max)
        }

        ipcEvent.onChangeDisplayInfo(onChangeDisplayInfo)
        ipcEvent.onChangeZoomLevel(onChangeZoomLevel)
        ipcEvent.onProgressFileLoading(onProgressFileLoading)

        ipcSend.readyDisplayInfo()

        return () => {
            ipcEvent.off('onChangeDisplayInfo', onChangeDisplayInfo)
            ipcEvent.off('onChangeZoomLevel', onChangeZoomLevel)
            ipcEvent.off('onProgressFileLoading', onProgressFileLoading)
        }
    }, [])

    return (
        <Theme className={displayInfoStyle.displayInfo}>
            {filePath ? (
                <>
                    <Box className={displayInfoStyle.topBox}>
                        <Typography className={displayInfoStyle.filePath}>{filePath}</Typography>
                        <Typography className={displayInfoStyle.progress}>{`${(current || max) ? current + ' / ' + max : ''}`}</Typography>
                    </Box>

                    <Box className={displayInfoStyle.bottomBox}>
                        <Typography className={displayInfoStyle.fileSize}>{fileSize}</Typography>
                        <Typography className={displayInfoStyle.imageSize}>{`${(sizeW || sizeH) ? (sizeW + ' x ' + sizeH) : ''}`}</Typography>
                        <Typography className={displayInfoStyle.zoomLevel}>{`${zoomLevel.toFixed(2)}`} %</Typography>
                    </Box>
                </>
            ) : (
                <Typography className="no-file">Display file information here if file selected</Typography>
            )}
        </Theme>
    )
}
