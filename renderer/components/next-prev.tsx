import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

import { Canvg } from 'canvg'

console.log('global.document', global.document)



export default function NextPrev() {

    const [status, setStatus] = useState('') // ['default', 'block']

    const createdNextIcon = useRef(false)
    const createdPrevIcon = useRef(false)
    const createdBlockIcon = useRef(false)

    const nextB64 = useRef('')
    const prevB64 = useRef('')
    const blockB64 = useRef('')



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        const createNextIcon = () => {
            if (createdNextIcon.current) { return }
            createdNextIcon.current = true

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
                    })
                })
            }, 64)
        }

        const createPrevIcon = () => {
            if (createdPrevIcon.current) { return }
            createdPrevIcon.current = true

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
                    })
                })
            }, 64)
        }

        const createBlockIcon = () => {
            if (createdBlockIcon.current) { return }
            createdBlockIcon.current = true

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

        ipcEvent.onStartLoading(() => {
            console.log('NextPrev: onStartLoading: set status block')
            setStatus('block')
        })

        ipcEvent.onEndLoading(() => {
            console.log('NextPrev: onEndLoading: set status default')
            setStatus('default')
        })

        ipcSend.readyNextPrev()
    })



    const clickNext = () => {
        if (status === 'block') { return }
        console.log('NextPrev: clickNext')

        const ipcSend = (window as any).ipcSend
        ipcSend.clickNext()
    }

    const clickPrev = () => {
        if (status === 'block') { return }
        console.log('NextPrev: clickPrev')

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
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    cursor: `url(${status !== 'block' ? nextB64.current : blockB64.current }), auto`,
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
                    cursor: `url(${status !== 'block' ? prevB64.current : blockB64.current }), auto`,
                }}
            ></Box>
        </>
    )
}


