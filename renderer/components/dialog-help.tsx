import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider
} from "@mui/material";

import styled from "@emotion/styled";

import Env from "../../main/components/env";


const StyledDialogText = styled(DialogContentText)({
    color: '#646464',
    fontSize: '0.95rem',
    fontWeight: 500,
})

const StyledDivider = styled(Divider)({
    marginTop: '1rem',
})



export default function DialogHelp(props) {

    const [env, setEnv] = useState<typeof Env>({
        name: '',
        description: '',
        version: '',
        author: '',
        homepage: '',
        isProd: true,
        font_styles: '',
    })

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onEnv = (env) => {
            setEnv(env)
        }

        ipcEvent.onEnv(onEnv)

        return () => {
            ipcEvent.off('onEnv', onEnv)
        }
    }, [])

    const handleClose = () => {
        props.setShowDialogHelp(false)
    }

    return (
        <Dialog
            open={props.show}
            onClose={handleClose}
            className={`dialog-help ${props.show ? 'active' : 'inactive'}`}
        >
            <DialogContent>
                <DialogTitle>
                    {env.name}
                </DialogTitle>

                <StyledDialogText>
                    {env.description}
                </StyledDialogText>

                <StyledDialogText>
                    Version. {env.version}
                </StyledDialogText>

                <StyledDialogText>
                    Author. {env.author}
                </StyledDialogText>

                <StyledDialogText>
                    {env.homepage}
                </StyledDialogText>

                <StyledDivider />

                <DialogTitle>
                    Control
                </DialogTitle>

                <StyledDialogText>
                    Click:
                        Toggle show/hide to display information bar
                </StyledDialogText>

                <StyledDialogText>
                    Double click:
                        Reset image position
                </StyledDialogText>

                <StyledDialogText>
                    Drag:
                        Move image position
                </StyledDialogText>

                <StyledDialogText>
                    Click with Right Button:
                        Change image size original or fit to window
                </StyledDialogText>

                <StyledDialogText>
                    Wheel:
                        Change zoom level
                </StyledDialogText>
            </DialogContent>
        </Dialog>
    )
}


