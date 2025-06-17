import { Typography } from "@mui/material";

export const DisplaySmall = ({ text, children, ...props }) => (
    <Typography
        variant="h1"
        color="text.secondary"
        sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            lineHeight: '44px',
            fontWeight: 600,
            fontStyle: 'normal',
        }}
        {...props}
    >
        {text}
        {children}
    </Typography>
);

export const DisplayMedium = ({ children, ...props }) => (
    <Typography
        variant="h1"
        color="text.secondary"
        sx={{
            fontSize: { xs: '2.5rem', md: '3rem' },
            lineHeight: '52px',
            fontWeight: 600,
            fontStyle: 'normal',
        }}
        {...props}
    >
        {children}
    </Typography>
);
