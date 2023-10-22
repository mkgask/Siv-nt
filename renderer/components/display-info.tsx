import { useEffect, useState } from "react"
import styled from '@emotion/styled'
import { Typography } from "@mui/material"

const Theme = styled('div')(({ theme }) => {
    return {
        backgroundColor: '#2885D181',
        color: '#ffffff',
    }
})



export default function DisplayInfo() {

    const [active, setActive] = useState(true)
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

        const onToggleMenuBar = () => {
            setActive((prevActive) => {
                const newActive = !prevActive
                console.log('Fileinfo: onToggleMenuBar(): prevActive -> newActive ', prevActive, ' -> ', newActive)
                ipcSend.settings('display_info_enabled', newActive )
                return newActive
            })
        }

        const onSettings = (settings) => {
            console.log('FileInfo: onSettings(): settings.display_info_enabled : ', settings.display_info_enabled)
            setActive(settings.display_info_enabled)
        }

        ipcEvent.onChangeFileInfo(onChangeFileInfo)
        ipcEvent.onChangeZoomLevel(onChangeZoomLevel)
        ipcEvent.onToggleMenuBar(onToggleMenuBar)
        ipcEvent.onSettings(onSettings)

        ipcSend.readyFileInfo()

        return () => {
            ipcEvent.off('onChangeFileInfo', onChangeFileInfo)
            ipcEvent.off('onToggleMenuBar', onToggleMenuBar)
            ipcEvent.off('onSettings', onSettings)
        }
    }, [])

    return (
        <Theme className={`file-info ${active ? 'active' : 'inactive'}`}>
            {filePath ? (
                <>
                    <Typography className="file-path">{filePath}</Typography>
                    <Typography className="file-size">{fileSize}</Typography>
                    <Typography className="image-size">{`${(sizeW || sizeH) ? (sizeW + ' x ' + sizeH) : ''}`}</Typography>
                    <Typography className="zoom-level">{`${zoomLevel.toFixed(2)}`}%</Typography>
                </>
            ) : (
                <Typography className="no-file">Display file information here if file selected</Typography>
            )}
        </Theme>
    )
}
