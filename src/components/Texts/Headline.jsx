import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HeadlineSmall = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="h2"
            className={`text-2xl leading-8 font-semibold align-middle ${className}`}
            sx={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0%',
                lineHeight: '32px',
                fontSize: '24px',
                fontWeight: 600,
                verticalAlign: 'middle',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

const HeadlineLarge = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="h2"
            className={`text-3xl leading-10 font-semibold align-middle ${className}`}
            sx={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0%',
                lineHeight: '40px',
                fontSize: '32px',
                fontWeight: 600,
                verticalAlign: 'middle',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

export { HeadlineSmall, HeadlineLarge }; 