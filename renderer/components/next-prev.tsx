import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

import { Canvg } from 'canvg'

console.log('global.document', global.document)



export default function NextPrev() {

    //const next_b64 = useRef('')
    const [next_b64, setNext_b64] = useState('')
    const [prev_b64, setPrev_b64] = useState('')

    const [nextButton, setNextButton] = useState<any>(null)
    const [prevButton, setPrevButton] = useState<any>(null)

    const createdNextButton = useRef(false)
    const createdPrevButton = useRef(false)
    const nextB64 = useRef('')
    const prevB64 = useRef('')
    const blockB64 = useRef('')



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        const createNextIcon = () => {
            if (createdNextButton.current) { return }
            createdNextButton.current = true

            const createRoot = require('react-dom/client').createRoot
            const dummyElement = global.document.createElement('div')
            const dummyRoot = createRoot(dummyElement)
            dummyRoot.render(<NavigateNextRoundedIcon />)

            setTimeout(() => {
                let svg: string = dummyElement.innerHTML
                console.log('svg', svg)
                svg = svg.replace(/viewBox="/, 'fill="#ffffff" width="32" height="32" viewBox="')
                svg = svg.replace(/<path d="/, '<path color="#ffffff" d="')
                console.log('svg', svg)
                const svgElement = global.document.createElement('canvas')
                const ctx = svgElement.getContext('2d')

                let v = Canvg.from(ctx, svg).then((v) => {
                    v.render().then(() => {
                        console.log('svgElement.toDataURL', svgElement.toDataURL())
                        nextB64.current = svgElement.toDataURL()
                        setNext_b64(svgElement.toDataURL())
                    })
                })
            }, 64)
        }

        const createPrevIcon = () => {
            if (createdPrevButton.current) { return }
            createdPrevButton.current = true

            const createRoot = require('react-dom/client').createRoot
            const dummyElement = global.document.createElement('div')
            const dummyRoot = createRoot(dummyElement)
            dummyRoot.render(<NavigateBeforeRoundedIcon />)

            setTimeout(() => {
                let svg: string = dummyElement.innerHTML
                console.log('svg', svg)
                svg = svg.replace(/viewBox="/, 'fill="#ffffff" width="32" height="32" viewBox="')
                svg = svg.replace(/<path d="/, '<path color="#ffffff" d="')
                console.log('svg', svg)
                const svgElement = global.document.createElement('canvas')
                const ctx = svgElement.getContext('2d')

                let v = Canvg.from(ctx, svg).then((v) => {
                    v.render().then(() => {
                        console.log('svgElement.toDataURL', svgElement.toDataURL())
                        prevB64.current = svgElement.toDataURL()
                        setPrev_b64(svgElement.toDataURL())
                    })
                })
            }, 64)
        }

        const createBlockIcon = () => {
            const createRoot = require('react-dom/client').createRoot
            const dummyElement = global.document.createElement('div')
            const dummyRoot = createRoot(dummyElement)
            dummyRoot.render(<BlockRoundedIcon />)

            setTimeout(() => {
                let svg: string = dummyElement.innerHTML
                console.log('svg', svg)
                svg = svg.replace(/viewBox="/, 'fill="#ffffff" width="32" height="32" viewBox="')
                svg = svg.replace(/<path d="/, '<path color="#ffffff" d="')
                console.log('svg', svg)
                const svgElement = global.document.createElement('canvas')
                const ctx = svgElement.getContext('2d')

                let v = Canvg.from(ctx, svg).then((v) => {
                    v.render().then(() => {
                        console.log('svgElement.toDataURL', svgElement.toDataURL())
                        blockB64.current = svgElement.toDataURL()
                    })
                })
            }, 64)
        }

        createNextIcon()
        createPrevIcon()
        createBlockIcon()

        const setIcon = (type: string, status: string) => {
            if (!type || !status) { return }

            const b64 = status === 'next' ?
                nextB64.current : status === 'prev' ?
                    prevB64.current : blockB64.current
            if (!b64) { return }

            if (type === 'next') {
                setNext_b64(b64)
                return
            }

            setPrev_b64(b64)
        }

        ipcEvent.onStartLoading(() => {
            setIcon('next', 'block')
            setIcon('prev', 'block')
        })

        ipcEvent.onEndLoading(() => {
            setIcon('next', 'next')
            setIcon('prev', 'prev')
        })

        ipcSend.readyNextPrev()
    })



    const clickNext = () => {
        const ipcSend = (window as any).ipcSend
        ipcSend.clickNext()
    }

    const clickPrev = () => {
        const ipcSend = (window as any).ipcSend
        ipcSend.clickPrev()
    }

    return (
        <>
            <Box
                className='next'
                onClick={clickNext}
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '16%',
                    height: '100%',
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    cursor: `url(${next_b64}), auto`,
                }}
            ></Box>
            <Box
                className='prev'
                onClick={clickPrev}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '16%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    cursor: `url(${prev_b64}), auto`,
                }}
            ></Box>
        </>
    )
}


