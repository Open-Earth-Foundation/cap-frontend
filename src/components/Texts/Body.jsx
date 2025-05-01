import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const BodyMedium = ({ text, children, className = '', ...props }) => {
    const { t } = useTranslation();
    const content = text || children;

    return (
        <Typography
            variant="body2"
            className={`text-[14px] leading-5 tracking-[0.5px] font-normal ${className}`}
            sx={{
                fontFamily: 'Open Sans, sans-serif',
                letterSpacing: '0.5px',
                lineHeight: '20px',
                fontSize: '14px',
                fontWeight: 400,
            }}
            {...props}
        >
            {typeof content === 'string' ? t(content) : content}
        </Typography>
    );
};

const BodyLarge = ({ text, children, className = '', ...props }) => {
    const { t } = useTranslation();
    const content = text || children;

    return (
        <Typography
            variant="body2"
            className={`text-[14px] leading-5 tracking-[0.5px] font-normal ${className}`}
            sx={{
                fontFamily: 'Open Sans, sans-serif',
                letterSpacing: '0.5px',
                lineHeight: '24px',
                fontSize: '16px',
                fontWeight: 400,
            }}
            {...props}
        >
            {typeof content === 'string' ? t(content) : content}
        </Typography>
    );
};

export { BodyMedium, BodyLarge };