import React, { useEffect } from "react"
import Box from "@mui/material/Box"


export default function FileInfo() {

    const [filePath, setFilePath] = React.useState(null)
    const [fileSize, setFileSize] = React.useState(null)

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
        <Box className="file-info">
            <p className="file-path">{filePath}</p>
            <p className="file-size">{fileSize}</p>
        </Box>
    )
}
