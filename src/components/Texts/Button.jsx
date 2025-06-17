import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ButtonMedium = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="button"
            className={`text-sm leading-4 font-semibold text-center align-middle uppercase ${className}`}
            sx={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '1.25px',
                lineHeight: '16px',
                fontSize: '14px',
                fontWeight: 600,
                verticalAlign: 'middle',
                textAlign: 'center',
                textTransform: 'uppercase',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

export { ButtonMedium }; 