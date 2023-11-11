import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import styled from "@emotion/styled"


const StyledBox = styled(Box)({
    position: 'fixed',
    top: '0.5rem',
    right: '0.5rem',
    width: '2rem',
    height: '2rem',

    zIndex: 65535,

    '&::before': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        margin: 'auto',
        width: '1rem',
        height: '1rem',
        border: '0.32rem solid #33BEA7',
        borderRight: '0.5rem solid transparent',
        borderRadius: '50%',
        animation: 'loading 2s linear infinite',
    },

    '&::after': {
        content: '""',
        display: 'inline-block',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        margin: 'auto',
        width: '2rem',
        height: '2rem',
        border: '0.32rem solid #2C48A3',
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

    const [show, setShow] = useState(true)



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