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
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0%',
                lineHeight: '24px',
                fontSize: '16px',
                fontWeight: 600,
                verticalAlign: 'middle',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

const TitleLarge = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="h3"
            className={`text-xl leading-7 font-semibold align-middle ${className}`}
            sx={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0%',
                lineHeight: '28px',
                fontSize: '22px',
                fontWeight: 600,
                verticalAlign: 'middle',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

const TitleSmall = ({ children, className = '', ...props }) => {
    const { t } = useTranslation();

    return (
        <Typography
            variant="h6"
            className={`text-sm leading-5 font-semibold align-middle ${className}`}
            sx={{
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0px',
                lineHeight: '20px',
                fontSize: '14px',
                fontWeight: 600,
                verticalAlign: 'middle',
            }}
            {...props}
        >
            {typeof children === 'string' ? t(children) : children}
        </Typography>
    );
};

export { TitleMedium, TitleLarge, TitleSmall }; 