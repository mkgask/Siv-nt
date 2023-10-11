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
        const { ipc } = window as any

        ipc.onChangeFilePath((path) => {
            console.log('Fileinfo: onChangeFilePath: path: ', path)
            setFilePath(path)
        })

        ipc.onChangeFileSize((size) => {
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
