import React, { useEffect, useReducer, useRef, useState } from 'react'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import styled from '@emotion/styled'

import type Point from '../types/point'



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



const calculateDisplayFileSize = (size: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
    return display_size
}



const calculateStyleValue2Px = (value: string, key: string, parent): number => {
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



let imageMarginLeft: number = 0
let imageMarginTop: number = 0
let mouseDownPosition: Point = { x: 0, y: 0 }

let mediaW: number = 0
let mediaH: number = 0



export default function MediaViewer() {

    const imageRef = useRef(null)

    const [isProd, setIsProd] = useState(false)
    const [accepted_types, setAcceptedTypes] = useState({})
    const [mouse_move_ratio, setMouseMoveRatio] = useState(16)

    const [src, setSrc] = useState(null)
    const [type, setType] = useState(null)
    const [mediaRatio, setMediaRatio] = useState(default_media_ratio)
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
            mediaW = media.imagesize_w
            mediaH = media.imagesize_h

            toggleViewSizeOriginalOrWindow('window')
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
        const newW = (w * ratio / 100)
        const newH = h * ratio / 100
        console.log('changeViewSize(): ', newW, 'x', newH, ' ', ratio, '%')
        setViewW(newW)
        setViewH(newH)
        setMediaRatio(ratio)
        ; (window as any).ipcSend.changeZoomLevel(ratio)
    }

    const changeViewSizeOriginal = () => {
        console.log('changeViewSizeOriginal(): ', mediaW, 'x', mediaH)
        changeViewSize(mediaW, mediaH, 100)
    }

    const changeViewSizeWindow = () => {
        const windowW = window.innerWidth
        const windowH = window.innerHeight
        console.log('changeViewSizeWindow(): ', windowW, 'x', windowH)

        // ウィンドウサイズに対する画像サイズのmediaRatioを計算
        const mediaratio = Math.min(windowW / mediaW, windowH / mediaH) * 100
        changeViewSize(mediaW, mediaH, mediaratio)
    }



    /*  画像の表示をウィンドウサイズまたは原寸サイズに変更する
     *  @param {string} mode - 'both' or 'window' or 'original'
    */
    const toggleViewSizeOriginalOrWindow = (mode = 'both') => {
        console.log('toggleViewSizeOriginalOrWindow(): viewW: ', viewW)
        console.log('toggleViewSizeOriginalOrWindow(): Math.abs(viewW - window.innerWidth): ', Math.abs(viewW - window.innerWidth))
        console.log('toggleViewSizeOriginalOrWindow(): Math.abs(viewW - window.innerWidth) < 1: ', Math.abs(viewW - window.innerWidth) < 1)
        console.log('toggleViewSizeOriginalOrWindow(): viewH: ', viewH)
        console.log('toggleViewSizeOriginalOrWindow(): Math.abs(viewH - window.innerHeight): ', Math.abs(viewH - window.innerHeight))
        console.log('toggleViewSizeOriginalOrWindow(): Math.abs(viewH - window.innerHeight) < 1: ', Math.abs(viewH - window.innerHeight) < 1)

        // 表示サイズがウィンドウと同じサイズだったら原寸に戻す
        if (
            ((
                Math.abs(viewW - window.innerWidth) < 1
            ) ||
            (
                Math.abs(viewH - window.innerHeight) < 1
            )) || mode === 'original'
        ) {
            changeViewSizeOriginal()
            return
        }

        // ウィンドウサイズにする
        changeViewSizeWindow()
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
            toggleViewSizeOriginalOrWindow()
            return
        }

        // マウスの移動が大きかった時は何もしない
        const moveDistance = Math.hypot(
            event.clientX - mouseDownPosition.x,
            event.clientY - mouseDownPosition.y
        )

        if (moveDistance > 5) { return }

        console.log('handleClick(): ipcSend.toggleMenuBar()')
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


