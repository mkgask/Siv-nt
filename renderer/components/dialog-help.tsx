import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Dialog, DialogContent, DialogContentText, DialogTitle, Divider, colors } from "@mui/material";

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
        isProd: false,
        isDev: false,
    })

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        ipcEvent.onEnv((env) => {
            setEnv(env)
        })
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


