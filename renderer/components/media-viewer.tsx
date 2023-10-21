import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import styled from '@emotion/styled'



const Theme = styled('div')(({ theme }) => {
    return {
        width: '100%',
        height: '100%',
    }
})

const StyledBox = styled(Box)(({ theme }) => {
    return {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})



const calculateDisplayFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
    return display_size
}



const calculateStyleValue2Px = (value: string, key: string, parent) => {
    const last2 = value.slice(-2)
    
    // 最後の2文字に'px'を持っていたら数値にして返す
    if (last2 === 'px') { return parseFloat(value) }

    // 最後の2文字に'vw'を持っていたらウィンドウサイズに合わせて数値にして返す
    if (last2 === 'vw') { return window.innerWidth * parseFloat(value) / 100 }

    // 最後の2文字に'vh'を持っていたらウィンドウサイズに合わせて数値にして返す
    if (last2 === 'vh') { return window.innerHeight * parseFloat(value) / 100 }

    // 最後の1文字が'%'だったらキーにあわせて親要素の大きさに合わせて数値にして返す
    if (last2.slice(-1) === '%') {
        if (
            key === 'height' ||
            key === 'marginTop' || key === 'marginBottom' ||
            key === 'paddingTop' || key === 'paddingBottom' ||
            key === 'top' || key === 'bottom'
        ) {
            return parent.offsetHeight * parseFloat(value.slice(0, -1)) / 100
        }

        if (
            key === 'width' ||
            key === 'marginLeft' || key === 'marginRight' ||
            key === 'paddingLeft' || key === 'paddingRight' ||
            key === 'left' || key === 'right'
        ) {
            return parent.offsetWidth * parseFloat(value.slice(0, -1)) / 100
        }
    }

    return 0
}



const default_media_ratio = 100
const zoom_ratio = -0.05



let imageMarginLeft = 0
let imageMarginTop = 0
let mouseDownPosition = { x: 0, y: 0 }



export default function MediaViewer() {

    const imageRef = useRef(null)

    const [isProd, setIsProd] = useState(false)
    const [accepted_types, setAcceptedTypes] = useState({})
    const [mouse_move_ratio, setMouseMoveRatio] = useState(16)

    const [src, setSrc] = useState(null)
    const [type, setType] = useState(null)
    const [mediaRatio, setMediaRatio] = useState(default_media_ratio)
    const [mediaW, setMediaW] = useState(0)
    const [mediaH, setMediaH] = useState(0)
    const [viewW, setViewW] = useState(5120)
    const [viewH, setViewH] = useState(5120)

    const [leftClick, setLeftClick] = useState(null)
    const [rightClick, setRightClick] = useState(null)



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        ipcEvent.onChangeView((media) => {
            console.log('MediaViewer: onChangeView: media: ', media)
            if (!media || !media.mime_type || !media.b64) { return }
            const dataURI = `data:${media.mime_type};base64,${media.b64}`
            setType(media.type)
            setSrc(dataURI)
            setMediaW(media.imagesize_w)
            setMediaH(media.imagesize_h)

            const viewSizeRatio = defaultViewSizeRatio(media.imagesize_w, media.imagesize_h)
            changeViewSize(media.imagesize_w, media.imagesize_h, viewSizeRatio)
        })

        ipcEvent.onEnv((env) => {
            console.log('MediaViewer: onEnv: env: ', env)
            console.log('MediaViewer: onEnv: env.isProd: ', env.isProd)
            setIsProd(env.isProd)
            console.log('MediaViewer: onEnv: mouse_move_ratio: ', mouse_move_ratio)
        })

        ipcEvent.onSettings((settings) => {
            console.log('MediaViewer: onSettings: settings: ', settings)
            setAcceptedTypes(settings.accepted_types)
            setMouseMoveRatio(settings.mouse_move_ratio)
        })

        ; (window as any).ipcSend.readyMediaViewer()
    }, [])

    const changeViewSize = (w, h, ratio) => {
        setViewW(w * ratio / 100)
        setViewH(h * ratio / 100)
    }

    const defaultViewSizeRatio = (w, h) => {
        // ウィンドウの大きさを取得
        const windowW = window.innerWidth
        const windowH = window.innerHeight

        // 画像のほうが大きかったらウィンドウの大きさに合わせる
        if (w > windowW || h > windowH) {
            const mediaratio = Math.min(windowW / w, windowH / h) * 100
            setMediaRatio(mediaratio)
            return mediaratio
        }

        setMediaRatio(default_media_ratio)
        return default_media_ratio
    }



    const handleDrop = (event) => {
        event.preventDefault()
        console.log('handleDrop()')

        const file = event.dataTransfer.files[0]

        if (accepted_types[file.type] === undefined) {
            alert('許可されていないファイル形式です')
            return
        }

        const type = accepted_types[file.type]
        setType(type)

        const path = file.path;
        const filesize = calculateDisplayFileSize(file.size)

        ;(window as any).ipcSend.changeView({
            type: type,
            mime_type: file.type,
            path: path,
            filesize: filesize,
        })
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        console.log('handleDragOver()')
    }



    const handleWheel = (event) => {
        console.log('handleWheel()')

        const mediaratio = Math.min(Math.max(10, mediaRatio + event.deltaY * zoom_ratio), 1000)
        setMediaRatio(mediaratio)
        changeViewSize(mediaW, mediaH, mediaratio)
    }


    const handleDoubleClick = (event) => {
        event.preventDefault()
        console.log('handleDoubleClick()')

        // 画像の位置をリセット
        imageMarginLeft = 0
        imageMarginTop = 0
        
        requestAnimationFrame(() => {
            if (imageRef === null || imageRef.current === null) { return }
            imageRef.current.style.transform = `translate(${imageMarginLeft}px, ${imageMarginTop}px)`
        })
    }

    const handleClick = (event) => {
        event.preventDefault()
        console.log('handleClick()')

        // 右クリックが押されている時は画像の表示サイズを変更する
        if (rightClick) {
            // ウィンドウの大きさと画像の大きさが同じだったら画像の原寸にする
            if (
                (
                    viewW === window.innerWidth &&
                    viewH <= window.innerHeight
                ) ||
                (
                    viewH === window.innerHeight &&
                    viewW <= window.innerWidth
                )
            ) {
                setMediaRatio(default_media_ratio)
                changeViewSize(mediaW, mediaH, default_media_ratio)
                return
            }

            // ウィンドウの大きさにする
            const viewSizeRatio = defaultViewSizeRatio(mediaW, mediaH)
            changeViewSize(mediaW, mediaH, viewSizeRatio)
            return
        }

        // マウスの移動が大きかった時は何もしない
        const moveDistance = Math.hypot(
            event.clientX - mouseDownPosition.x,
            event.clientY - mouseDownPosition.y
        )

        if (moveDistance > 5) { return }

        ;(window as any).ipcSend.toggleMenuBar()
    }

    const handleMouseDown = (event) => {
        event.preventDefault()
        console.log('handleMouseDown()')

        mouseDownPosition.x = event.clientX
        mouseDownPosition.y = event.clientY

        // 左クリックチェック
        if (event.button === 0) { setLeftClick(true) }

        // 右クリックチェック
        if (event.button === 2) { setRightClick(true) }
    }

    const handleMouseUp = (event) => {
        event.preventDefault()
        console.log('handleMouseUp()')

        // 左クリックチェック
        if (event.button === 0) { setLeftClick(false) }

        // 右クリックチェック
        if (event.button === 2) { setRightClick(false) }
    }

    const handleMouseMove = (event) => {
        event.preventDefault()
        //console.log('handleMouseMove()')

        // 左クリックが押されている時は画像を移動する
        if (leftClick) {
            // 移動量から移動の方向だけ取得
            const moveX =
                (0 < (event.movementX)) ? 1 :
                ((event.movementX) < 0) ? -1 :
                0

            const moveY =
                (0 < (event.movementY)) ? 1 :
                ((event.movementY) < 0) ? -1 :
                0

            imageMarginLeft += (moveX * mouse_move_ratio);
            imageMarginTop += (moveY * mouse_move_ratio);

            requestAnimationFrame(() => {
                if (imageRef === null || imageRef.current === null) { return }
                imageRef.current.style.transform = `translate(${imageMarginLeft}px, ${imageMarginTop}px)`
            })
        }
    }



    return (
        <Theme>
            <StyledBox
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="media-viewer"
            >
                {src && type === 'image' &&
                    <Image
                        ref={imageRef}
                        className='media-viewer-image'
                        src={src}
                        alt='Image'
                        layout='inrinsic'
                        width={viewW}
                        height={viewH}
                        style={{ objectFit: 'contain' }}
                    />
                }
    {/*
                {src && type === 'video' &&
                    <video
                        className='media-viewer-video'
                        src={src}
                    />
                }
                {src && type === 'audio' &&
                    <audio
                        className='media-viewer-audio'
                        src={src}
                    />
                }
    */}
                {(!src || !type) &&
                    <Typography
                        className='media-viewer-drag-here'
                    >
                        Drop any media file here
                    </Typography>
                }
            </StyledBox>
        </Theme>
    )
}


