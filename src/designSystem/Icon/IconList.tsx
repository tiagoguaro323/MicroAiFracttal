import React, { FC } from 'react';
import { Grid, Tooltip, Typography } from '@mui/material';

import { Icon } from 'designSystem';
import { temp } from 'designSystem/Icon/variants';

const IconList: FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Icon
      </Typography>
      <Grid container spacing={2}>
        {temp.map(
          (iconName, index) =>
            iconName && (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item xs={3} sm={2} md={1} key={index}>
                <Tooltip title={iconName} arrow>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon variantName={iconName} size="large" />
                  </div>
                </Tooltip>
                <Typography variant="caption" display="block" align="center">
                  {iconName}
                </Typography>
              </Grid>
            ),
        )}
      </Grid>
    </div>
  );
};

export default IconList;
