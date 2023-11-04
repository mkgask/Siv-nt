import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Slider,
    Stack,
    Switch
} from "@mui/material";

import styled from "@emotion/styled";



const StyledStack = styled(Stack)({
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '50vw',
    gap: '3vw',
    justifyContent: 'space-between',
})

const InnerStack = styled(Stack)({
    gap: '3vw',
    alignItems: 'center',
})

const StyledDialogText = styled(DialogContentText)({
    flexShrink: 0,
})

const StyledDivider = styled(Divider)({
    marginTop: '1rem',
})




export default function DialogSettings(props) {

    const [image_move_ratio, setImageMoveRatio] = useState(1)
    const [zoom_change_ratio, setZoomChangeRatio] = useState(5)
    const [log_output, setLogOutput] = useState(false)

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onSettings = (settings) => {
            setImageMoveRatio(settings.image_move_ratio)
            setZoomChangeRatio(settings.zoom_change_ratio)
            setLogOutput(settings.log_output)
        }

        ipcEvent.onSettings(onSettings)

        return () => {
            ipcEvent.off('onSettings', onSettings)
        }
    }, [])

    const handleImageMoveRatioChange = (event, newValue) => {
        event.preventDefault()
        console.log('DialogSettings: handleImageMoveRatioChange: ', newValue)
        setImageMoveRatio(newValue as number)
        ; (window as any).ipcSend.settings('image_move_ratio', newValue)
    }

    const handleZoomChangeRatioChange = (event, newValue) => {
        event.preventDefault()
        console.log('DialogSettings: handleZoomChangeRatioChange: ', newValue)
        setZoomChangeRatio(newValue as number)
        ; (window as any).ipcSend.settings('zoom_change_ratio', newValue)
    }

    const handleLogoutput = (event, newValue) => {
        event.preventDefault()
        console.log('DialogSettings: handleLogoutput: ', newValue)  
        setLogOutput(newValue as boolean)
        ; (window as any).ipcSend.settings('log_output', newValue)
    }

    const handleClose = () => {
        props.setShowDialogSettings(false)
    }

    return (
        <>
            <Dialog
                open={props.show}
                onClose={handleClose}
                maxWidth="lg"
                className={`dialog-settings ${props.show ? 'active' : 'inactive'}`}
            >
                <DialogContent>
                    <DialogTitle>
                        Settings
                    </DialogTitle>

                    <StyledDivider />

                    <StyledStack
                        direction="row"
                    >
                        <StyledDialogText>
                            Image move ratio
                        </StyledDialogText>

                        <InnerStack
                            direction="row"
                        >
                            <StyledDialogText>
                                {image_move_ratio}
                            </StyledDialogText>

                            <Slider
                                value={image_move_ratio}
                                min={1}
                                max={32}
                                onChange={handleImageMoveRatioChange}
                                sx={{ width: '10vw' }}
                            ></Slider>
                        </InnerStack>
                    </StyledStack>

                    <StyledDivider />

                    <StyledStack
                        direction="row"
                    >
                        <StyledDialogText>
                            Zoom change ratio
                        </StyledDialogText>

                        <InnerStack
                            direction="row"
                        >
                        <StyledDialogText>
                            {zoom_change_ratio}
                        </StyledDialogText>

                        <Slider
                            value={zoom_change_ratio}
                            min={1}
                            max={32}
                            onChange={handleZoomChangeRatioChange}
                            sx={{ width: '10vw' }}
                        ></Slider>
                        </InnerStack>
                    </StyledStack>

                    <StyledDivider />

                    <StyledStack
                        direction="row"
                    >
                        <StyledDialogText>
                            Log output
                        </StyledDialogText>

                        <InnerStack
                            direction="row"
                        >
                            <StyledDialogText>
                                {log_output ? 'On' : 'Off'}
                            </StyledDialogText>

                            <Switch
                                checked={log_output}
                                onChange={handleLogoutput}
                            ></Switch>
                        </InnerStack>
                    </StyledStack>

                </DialogContent>
            </Dialog>
        </>
    )
}