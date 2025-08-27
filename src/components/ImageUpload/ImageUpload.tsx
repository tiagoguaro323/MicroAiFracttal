import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  Fab,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  useTheme,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { CustomTooltip, DialogConfirm } from 'fracttal-core';
import FileUpload from 'components/FileUpload/FileUpload';
import { mainError, mainSuccess } from 'store/main/actions';
import DB from 'core/services/DB';
import { IRpc } from 'core/services/RequestRpc';
import Icon from 'designSystem/Icon';
import DrawerSign from './DrawerSign';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 500,
    },
    sideContent: {
      textAlign: 'center',
      margin: theme.spacing(2),
    },
    menu: {
      borderRadius: 10,
      border: 1,
      borderStyle: 'solid',
      borderColor:
        theme.palette.mode === 'dark'
          ? theme.palette.action.hover
          : theme.palette.divider,
    },
    imageWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      boxShadow: 'none',
      border: '1px solid',
      borderColor: theme.palette.divider,
      '& img': {
        width: '100%',
        objectFit: 'contain',
        maxHeight: 180,
        padding: theme.spacing(0.5),
      },
    },
  }),
);

interface IProps {
  className?: any;
  readOnly?: boolean;
  pathImage: string;
  updatePathImage?: any;
  signOption?: boolean;
  height?: number;
  width?: number;
}

const IMG_DEFAULT =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

const cached: string[] = [];

interface IPropsImg {
  src: any;
  width?: number | string;
  height?: number | string;
}

export function Img({ src = '', width = 'auto', height = 'auto' }: IPropsImg) {
  const [loadSrc, setLoadSrc] = useState(IMG_DEFAULT);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (src && src !== '') {
      if (cached.includes('src')) {
        setLoadSrc(src);
      } else {
        const i = new Image();
        i.onload = () => {
          setLoadSrc(src);
          setLoading(false);
          cached.push(src);
        };
        i.onerror = () => {
          setLoadSrc(IMG_DEFAULT);
          setLoading(false);
        };
        i.src = src;
        setLoading(true);
      }
    } else {
      setLoadSrc(IMG_DEFAULT);
    }
  }, [src]);

  if (loading) {
    return <CircularProgress />;
  }
  return <img width={width} height={height} src={loadSrc} />;
}

const ImageItem: FC<IProps> = ({
  className,
  readOnly = false,
  pathImage,
  updatePathImage,
  signOption = false,
  width = 180,
  height = 180,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const rootClassName = classes.sideContent;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openImage, setOpenImage] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [signImage, setSignImage] = useState(false);
  const [urlImage, setUrlImage] = useState<string | null>(
    '/images/photo-profile.svg',
  );
  const [menuEl, setMenuEl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      pathImage &&
      !pathImage.includes('X-Amz-Credential') &&
      pathImage !== 'classic/resources/images/background-img.png'
    ) {
      DB('companies.s3_object_get', { name: pathImage }, (res: IRpc) => {
        const { result } = res;
        if (result && result.success) {
          setUrlImage(result.data.url);
        } else if (result) {
          dispatch(mainError({ msg: t(result.message) }));
        }
      });
    } else if (pathImage === 'classic/resources/images/background-img.png') {
      setUrlImage(null);
    } else {
      setUrlImage(pathImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathImage]);

  const handlerOpenUpload = () => {
    setMenuEl(null);
    setOpen(true);
  };

  const handlerOpenImage = () => {
    setMenuEl(null);
    if (urlImage) setOpenImage(true);
  };

  const handlerSignImage = () => {
    setSignImage(true);
  };

  const handlerDeleteImage = () => {
    setMenuEl(null);
    if (urlImage) setDeleteImage(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSignImage(false);
  };

  // const handleCloseImage = () => {
  //   setOpenImage(false);
  // };

  const onUpload = (files: any[]) => {
    updatePathImage(files[0].fileName);
    setOpen(false);
    setSignImage(false);
  };

  const onDelete = async () => {
    setDeleteImage(false);
    updatePathImage(null);
    DB('companies.s3_object_delete', { name: urlImage }, (rst) => {
      const { result } = rst;
      if (result && result.success) {
        updatePathImage(null);
        setUrlImage('/images/photo-profile.svg');
        dispatch(mainSuccess({ msg: t(result.message) }));
        setDeleteImage(false);
      } else {
        result?.message && dispatch(mainError({ msg: t(result.message) }));
      }
      return false;
    });
  };

  const onOpenDetails = useCallback((event: any) => {
    setMenuEl(event.currentTarget);
  }, []);

  const onCloseDetails = useCallback(() => {
    setMenuEl(null);
  }, []);
  return (
    <div className={clsx(rootClassName, className)}>
      <div>
        <FileUpload
          open={open}
          onlyImages
          onClose={handleClose}
          multiple={false}
          rootPath=".images/"
          randomName
          onUpload={onUpload}
        />
        {deleteImage && (
          <DialogConfirm
            openDialogConfirm
            handleClose={() => setDeleteImage(false)}
            handleYes={onDelete}
            msg={t('ARE_YOU_SURE_DELETE')}
          />
        )}
        {signImage && (
          <DrawerSign
            onClose={handleClose}
            rootPath=".images/"
            onUpload={onUpload}
          />
        )}
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            !readOnly && (
              <CustomTooltip title={t('OPTIONS') || ''} placement="top">
                <Fab
                  className="qa-btn-options-image"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.content.primary,
                    boxShadow: 'none',
                  }}
                  aria-label={t('OPTIONS') || ''}
                  size="small"
                  onClick={onOpenDetails}
                >
                  <Icon
                    variantName="camera"
                    color={theme.palette.content.main}
                  />
                </Fab>
              </CustomTooltip>
            )
          }
        >
          <Box
            className={classes.imageWrapper}
            borderRadius="10px"
            height={height}
            width={width}
            mx="auto"
            bgcolor="background.paper"
          >
            <Img src={urlImage} />
          </Box>
        </Badge>
        <Menu
          anchorEl={menuEl}
          keepMounted
          open={Boolean(menuEl)}
          onClose={onCloseDetails}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{
            minWidth: 400,
          }}
          classes={{
            paper: classes.menu,
          }}
        >
          {urlImage && (
            <MenuItem className="qa-view-photo" onClick={handlerOpenImage}>
              <ListItemText primary={t('SHOW_IMAGE')} />
            </MenuItem>
          )}
          <MenuItem className="qa-updload-photo" onClick={handlerOpenUpload}>
            <ListItemText primary={t('UPLOAD_IMAGE')} />
          </MenuItem>
          {urlImage && (
            <MenuItem className="qa-delete-photo" onClick={handlerDeleteImage}>
              <ListItemText primary={t('DELETE_IMAGE')} />
            </MenuItem>
          )}
          {signOption && (
            <>
              <Divider />
              <MenuItem className="qa-sign-photo" onClick={handlerSignImage}>
                <ListItemText primary={t('SIGNATURE')} />
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default ImageItem;
