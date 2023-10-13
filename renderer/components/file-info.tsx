import { useEffect, useState } from "react"
import styled from '@emotion/styled'

const Theme = styled('div')(({ theme }) => {
    return {
    }
})



export default function FileInfo() {

    const [filePath, setFilePath] = useState(null)
    const [fileSize, setFileSize] = useState(null)

    useEffect(() => {
        const { ipcEvent } = window as any

        ipcEvent.onChangeFilePath((path) => {
            console.log('Fileinfo: onChangeFilePath: path: ', path)
            setFilePath(path)
        })

        ipcEvent.onChangeFileSize((size) => {
            console.log('Fileinfo: onChangeFileSize: size: ', size)
            setFileSize(size)
        })
    }, [])

    return (
        <Theme className="file-info">
            <p className="filepath">{filePath}</p>
            <p className="filesize">{fileSize}</p>
        </Theme>
    )
}
