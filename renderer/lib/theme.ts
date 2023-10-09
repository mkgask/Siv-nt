import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontSize: 12,
    },
    palette: {
        primary: {
            main: '#2885D181',
        },
        secondary: {
            main: '#27978C',
        },
        error: {
            main: red.A400,
        },
    },
})

export default theme
