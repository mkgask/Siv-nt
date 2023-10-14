import { useEffect, useState } from "react"
import styled from '@emotion/styled'
import { Typography } from "@mui/material"

const Theme = styled('div')(({ theme }) => {
    return {
    }
})



export default function FileInfo() {

    const [active, setActive] = useState(true)
    const [filePath, setFilePath] = useState(null)
    const [fileSize, setFileSize] = useState(null)
    const [sizeW, setSizeW] = useState(null)
    const [sizeH, setSizeH] = useState(null)

    useEffect(() => {

        const ipcEvent = (window as any).ipcEvent

        const onChangeFileInfo = (media) => {
            console.log('Fileinfo: onChangeFileInfo: media: ', media)
            setFilePath(media.path)
            setFileSize(media.filesize)
            setSizeW(media.imagesize_w)
            setSizeH(media.imagesize_h)
        }

        const onToggleMenuBar = () => {
            console.log('Fileinfo: onToggleMenuBar()')
            setActive(prevActive => !prevActive)
        }

        ipcEvent.onChangeFileInfo(onChangeFileInfo)
        ipcEvent.onToggleMenuBar(onToggleMenuBar)

        return () => {
            ipcEvent.off('onChangeFileInfo', onChangeFileInfo)
            ipcEvent.off('onToggleMenuBar', onToggleMenuBar)
        }
    }, [])

    return (
        <Theme className={`file-info ${active ? 'active' : 'inactive'}`}>
            {filePath || fileSize || sizeW || sizeH ? (
                <>
                    <Typography className="filepath">{filePath}</Typography>
                    <Typography className="filesize">{fileSize}</Typography>
                    <Typography className="imagesize">{`${(sizeW || sizeH) ? (sizeW + ' x ' + sizeH) : ''}`}</Typography>
                </>
            ) : (
                <Typography className="no-file">Display file information here if file selected</Typography>
            )}
        </Theme>
    )
}
