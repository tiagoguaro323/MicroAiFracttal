import React from 'react';
import {
  Checkbox as CheckboxMui,
  CheckboxProps,
  useTheme,
} from '@mui/material';
import { Icon } from 'designSystem';

export type IProps = CheckboxProps & {
  className?: string;
  disabled?: CheckboxProps['disabled'];
  minus?: boolean;
  disableRipple?: CheckboxProps['disableRipple'];
};

const Checkbox: React.FC<IProps> = ({
  className,
  disabled,
  minus,
  disableRipple = true,
  ...props
}) => {
  const theme = useTheme();
  const checkboxIcon =
    theme.palette.mode === 'dark' ? 'checkbox_dark' : 'checkbox';

  const checkboxIconDisabled =
    theme.palette.mode === 'dark'
      ? 'checkbox_disabled_dark'
      : 'checkbox_disabled_light';

  const checkedIcon =
    theme.palette.mode === 'dark' ? 'checked_dark' : 'checked';

  const checkedIconDisabled =
    theme.palette.mode === 'dark'
      ? 'checked_disabled_dark'
      : 'checked_disabled_light';

  return (
    <CheckboxMui
      checkedIcon={
        minus ? (
          <Icon variantName="checked_minus" />
        ) : (
          <Icon variantName={disabled ? checkedIconDisabled : checkedIcon} />
        )
      }
      className={className}
      disableRipple={disableRipple}
      disabled={disabled}
      icon={
        <Icon
          className="ico"
          variantName={disabled ? checkboxIconDisabled : checkboxIcon}
          color="transparent"
        />
      }
      {...props}
    />
  );
};

export default Checkbox;
