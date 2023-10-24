import styled from "@emotion/styled";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";



const StyledDialogText = styled(DialogContentText)({
    color: '#646464',
    fontSize: '0.95rem',
    fontWeight: 500,
})



export default function DialogHelp(props) {

    const handleClose = () => {
        props.setShowDialogHelp(false)
    }

    return (
        <Dialog
            open={props.show}
            onClose={handleClose}
            className={`dialog-help ${props.show ? 'active' : 'inactive'}`}
        >
            <DialogTitle>
                Help
            </DialogTitle>

            <DialogContent>
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


