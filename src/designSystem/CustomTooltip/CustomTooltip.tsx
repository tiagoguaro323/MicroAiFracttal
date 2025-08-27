import React from 'react';
import { Theme, Tooltip, useMediaQuery, TooltipProps } from '@mui/material';

interface IProps extends TooltipProps {
  children: any;
  title: string;
  arialLabel?: string;
}

const CustomTooltip = React.memo<IProps>(
  ({ arialLabel, title = '', children, ...rest }) => {
    const isMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.down('sm'),
    );

    return (
      <Tooltip
        title={isMobile ? '' : title}
        arial-label={arialLabel || undefined}
        {...rest}
      >
        {children}
      </Tooltip>
    );
  },
);

export default CustomTooltip;
