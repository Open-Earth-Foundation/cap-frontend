import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TitleMedium = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="h6"
            className={`text-base leading-6 font-semibold align-middle ${className}`}
            sx={{
                fontFamily: 'Poppins',
                letterSpacing: 0,
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

export { TitleMedium }; 