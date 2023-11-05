import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import styled from "@emotion/styled"
import DisplayInfo from "./display-info"


const StyledBox = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(32, 32, 32, 0.8)',
    zIndex: 65535,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 'calc(50% - 2rem)',
        left: 'calc(50% - 2rem)',
        width: '4rem',
        height: '4rem',
        border: '0.5rem solid #33BEA7',
        borderRight: '0.5rem solid transparent',
        borderRadius: '50%',
        animation: 'loading 2s linear infinite',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 'calc(50% - 2.5rem)',
        left: 'calc(50% - 2.5rem)',
        width: '5rem',
        height: '5rem',
        border: '0.5rem solid #2C48A3',
        borderLeft: '0.5rem solid transparent',
        borderRadius: '50%',
        animation: 'loading 2.5s linear infinite',
    },
    '@keyframes loading': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
})



export default function LoadingScreen() {

    const [show, setShow] = useState(false)



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onStartLoading = () => {
            console.log('LoadingScreen: onStartLoading')
            setShow(true)
        }

        const onEndLoading = () => {
            console.log('LoadingScreen: onEndLoading')
            setShow(false)
        }

        ipcEvent.onStartLoading(onStartLoading)
        ipcEvent.onEndLoading(onEndLoading)

        return () => {
            ipcEvent.off('onStartLoading', onStartLoading)
            ipcEvent.off('onEndLoading', onEndLoading)
        }
    })


    
    return (
        <>
            <StyledBox
                className={`loading-screen ${show ? 'active' : 'inactive'}`}
                style={{ display: show ? 'block' : 'none' }}
            />
        </>
    )
}