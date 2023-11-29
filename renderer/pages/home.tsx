import { useEffect, useState } from 'react'
import Head from 'next/head'

import {
    AppBar,
    Toolbar,
    styled,
} from '@mui/material'

import LoadingScreen from '../components/loading-screen'
import MediaViewer from '../components/media-viewer'
import NextPrev from '../components/next-prev'
import DisplayInfo from '../components/display-info'
import MenuBar from '../components/menu-bar'
import DialogHelp from '../components/dialog-help'
import DialogSettings from '../components/dialog-settings'
import DialogPackageLicense from '../components/dialog-package-lisences'
import Font from '../components/font'

import appBarStyle from './app-bar.module.css'

import type { EnvType } from '../../commonTypes/env-type'
import type { SettingsType } from '../../commonTypes/settings-type'



const Theme = styled('section')(({ theme }) => {
    return {
        textAlign: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#333333',
        color: '#ffffff',
    }
})

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: 'initial',
    backgroundColor: '#2885D181',
    color: '#ffffff',
    gap: '0.32vw',
    padding: '1rem 0',
    justifyContent: 'space-between',

    [`@media (min-width: ${theme.breakpoints.values.sm}px)`]: {
        minHeight: 'initial',
    },

    [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
        minHeight: 'initial',
    },
}))



function Home() {

    const [appName, setAppName] = useState('')
    const [appVersion, setAppVersion] = useState('')

    const [appBarActive, setAppBarActive] = useState(true)

    const [showDialogApi, setShowDialogApi] = useState(false)
    const [showDialogHelp, setShowDialogHelp] = useState(false)
    const [showDialogSettings, setShowDialogSettings] = useState(false)


    useEffect(() => {
        console.log('Home: useEffect: window: ', window)
        const ipcEvent = (window as any).ipcEvent

        const onToggleMenuBar = () => {
            setAppBarActive((prevAppBarActive) => {
                const newAppBarActive = !prevAppBarActive
                console.log('Home: onToggleMenuBar(): prevAppBarActive -> newAppBarActive ', prevAppBarActive, ' -> ', newAppBarActive)
                ; (window as any).ipcSend.settings('display_info_enabled', newAppBarActive )
                return newAppBarActive
            })
        }

        const onSettings = (settings: SettingsType) => {
            console.log('Home: onSettings(): settings.display_info_enabled : ', settings.display_info_enabled)
            setAppBarActive(settings.display_info_enabled)
        }

        const onEnv = (env: EnvType) => {
            console.log('Home: onEnv: env: ', env)
            setAppName(env.name)
            setAppVersion(env.version)
        }
    
        ipcEvent.onToggleMenuBar(onToggleMenuBar)
        ipcEvent.onSettings(onSettings)
        ipcEvent.onEnv(onEnv)

        return () => {
            ipcEvent.off('onToggleMenuBar', onToggleMenuBar)
            ipcEvent.off('onSettings', onSettings)
            ipcEvent.off('onEnv', onEnv)
        }
    }, [])



    return (
        <>
            <Head>
                <title>{appName} v{appVersion}</title>
            </Head>

            <Font />
            <LoadingScreen />

            <Theme>
                <MediaViewer></MediaViewer>
                <NextPrev></NextPrev>
            </Theme>

            <AppBar
                position='fixed'
                color="transparent"
                sx={{ top: 'auto', bottom: 0 }}
                className={`${appBarStyle.appBar} ${appBarActive ? 'appBar-active' : appBarStyle.inactive}`}
            >
                <StyledToolbar>
                    <DisplayInfo></DisplayInfo>
                    <MenuBar
                        openDialogApi={() => { setShowDialogApi(true) }}
                        openDialogHelp={() => { setShowDialogHelp(true) }}
                        openDialogSettings={() => { setShowDialogSettings(true) }}
                    ></MenuBar>
                </StyledToolbar>
            </AppBar>

            <DialogHelp
                show={showDialogHelp}
                setShowDialogHelp={setShowDialogHelp}
            ></DialogHelp>

            <DialogPackageLicense
                show={showDialogApi}
                setShowDialogPackageLicense={setShowDialogApi}
            ></DialogPackageLicense>

            <DialogSettings
                show={showDialogSettings}
                setShowDialogSettings={setShowDialogSettings}
            ></DialogSettings>
        </>
    )
}

export default Home
