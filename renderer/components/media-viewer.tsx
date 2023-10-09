import React, { useState } from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'


const accepted_types = {
    'image/png': 'image',
    'image/apng': 'image',
    'image/jpeg': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/svg+xml': 'image',
    'image/webp': 'image',
    'image/avif': 'image',
/*
    'video/mp4': 'video',
    'video/webm': 'video',
    'video/ogg': 'video',
    'video/quicktime': 'video',
    'video/x-msvideo': 'video',
    'video/x-ms-wmv': 'video',

    'audio/mp4': 'audio',
    'audio/mpeg': 'audio',
    'audio/ogg': 'audio',
    'audio/wav': 'audio',
    'audio/webm': 'audio',
*/
}



const calculateDisplayFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
    return display_size
}



function MediaViewer() {
    const [src, setSrc] = useState(null)
    const [type, setType] = useState(null)
    const [path, setPath] = useState(null)
    const [size, setSize] = useState(null)

    const handleDrop = (event) => {
        event.preventDefault()

        const file = event.dataTransfer.files[0]

        if (accepted_types[file.type] === undefined) {
            alert('画像ファイルをドロップしてください')
            return
        }

        const type = accepted_types[file.type]
        setType(type)

        const path = file.path
        setPath(path)

        const size = calculateDisplayFileSize(file.size)
        setSize(size)
/*
        window.ipc.changeView({
            type: type,
            path: path,
            size: size,
        })
*/
        const reader = new FileReader()
        reader.onload = (e) => { setSrc(e.target.result) }
        reader.readAsDataURL(file)
    }



    const handleDragOver = (event) => {
        event.preventDefault()
    }



    return (
        <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            {src && type === 'image' &&
                <Image
                    className='media-viewer'
                    src={src}
                    alt='Image'
                    layout='inrinsic'
                    width={5120}
                    height={5120}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
            }
{/*
            {src && type === 'video' &&
                <video
                    className='media-viewer'
                    src={src}
                />
            }
            {src && type === 'audio' &&
                <audio
                    className='media-viewer'
                    src={src}
                />
            }
*/}
            {(!src || !type) &&
                <Typography
                    className='media-viewer'
                >
                    Drop any media file here
                </Typography>
            }
        </Box>
    )
}



export default MediaViewer


