import { useEffect, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';

import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    styled
} from '@mui/material';

import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

import menuListStyle from './menu-bar.module.css';



const StyledMenuList = styled(MenuList)(({ theme }) => ({
    position: 'absolute',
    top: 'auto',
    left: 'auto',
    right: 0,
    backgroundColor: '#2885D181',
    color: '#ffffff',
}))

const StyledApiIcon = styled(ApiRoundedIcon)(({ theme }) => ({
    color: '#ffffff',
}))

const StyledHelpIcon = styled(HelpOutlineRoundedIcon)(({ theme }) => ({
    color: '#ffffff',
}))



export default function MenuBar() {

    const [menuOpen, setMenuOpen] = useState(false)

    const [displayInfoFilePath, setDisplayInfoFilePath] = useState('')



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onChangeFileInfo = (media) => {
            console.log('Home: onChangeFileInfo: media: ', media)
            setDisplayInfoFilePath(media.path)
        }

        ipcEvent.onChangeFileInfo(onChangeFileInfo)

        return () => {
            ipcEvent.off('onChangeFileInfo', onChangeFileInfo)
        }
    }, [])



    const handleMenuClick = (event) => {
        event.preventDefault()
        setMenuOpen(pervMenuOpen => !pervMenuOpen)
    }



    const handleApiClick = (event) => {
        event.preventDefault()
        ; (window as any).ipcSend.openDialogApi()
    }


    const handleHelpClick = (event) => {
        event.preventDefault()
        ; (window as any).ipcSend.openDialogHelp()
    }



    return (
        <>
            <MenuIcon
                onClick={handleMenuClick}
            ></MenuIcon>
            <StyledMenuList
                className={`
                    ${menuOpen ?
                        displayInfoFilePath ? menuListStyle.menuListActive : menuListStyle.menuListActiveAppbarInactive :
                        menuListStyle.inactive}
                `}
            >
                <MenuItem
                    onClick={handleApiClick}
                >
                    <ListItemIcon>
                        <StyledApiIcon></StyledApiIcon>
                    </ListItemIcon>
                    <ListItemText>
                        Package Lisences
                    </ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={handleHelpClick}
                >
                    <ListItemIcon>
                        <StyledHelpIcon></StyledHelpIcon>
                    </ListItemIcon>
                    <ListItemText>
                        Help
                    </ListItemText>
                </MenuItem>
            </StyledMenuList>
        </>
    )
}


