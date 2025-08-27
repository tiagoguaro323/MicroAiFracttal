import React, { FC, useMemo, useState } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Button, Icon } from 'designSystem';
import { GlobalDrawer } from 'fracttal-core';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Capacitor } from '@capacitor/core';
import DB from 'core/services/DB';
import { IRpc } from 'core/services/RequestRpc';
import { mainError } from 'store/main/actions';
import { useAuthorization } from 'hooks';
import { Authorization } from 'core/enums';

const useStyles = makeStyles((theme) =>
  createStyles({
    thumbsContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
    thumb: {
      display: 'inline-flex',
      borderRadius: 2,
      border: `1px solid ${theme.palette.other.divider}`,
      width: 100,
      height: 100,
      boxSizing: 'border-box',
    },
    thumbInner: {
      display: 'flex',
      minWidth: 0,
      overflow: 'hidden',
    },
    img: {
      display: 'block',
      width: 'auto',
      height: '100%',
    },
    dropzone: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: '2px',
      borderRadius: '2px',
      borderColor: theme.palette.other.divider,
      borderStyle: 'dashed',
      color: theme.palette.text.secondary,
      outline: 'none',
      transition: 'border .24s ease-in-out',
    },
  }),
);

interface IProps {
  className?: string;
  onlyImages?: boolean;
  randomName?: boolean;
  open: boolean;
  onClose: () => void;
  onUpload?: (files: any[]) => void;
  multiple?: boolean;
  rootPath?: string;
}

const FileUpload: FC<IProps> = ({
  onlyImages = false,
  randomName = false,
  open,
  onClose,
  onUpload,
  multiple = true,
  rootPath = '',
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const [files, setFiles] = useState<any[]>([]);
  const [hiddenProgress, setHiddenProgress] = useState(true);
  const { add: userCanAdd } = useAuthorization(
    Authorization.ATTACH_IMAGES_FROM_GALLERY,
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: onlyImages ? { 'image/*,.jpe,.jif': [] } : undefined,
    multiple,
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (!userCanAdd && !isLikelyCameraPhoto(file)) {
          dispatch(mainError({ msg: t('WITHOUT_PERMITS') }));
          return false;
        }
        return true;
      });

      if (!validFiles.length) return;

      const fileObjects = validFiles.map((file) => {
        const copy = new File([file], file.name, { type: file.type });
        (copy as any).preview = URL.createObjectURL(file);
        return copy;
      });

      setFiles(fileObjects);
    },
  });
  const { ...rootProps } = getRootProps();
  const dispatch = useDispatch();
  const isIos = Capacitor.getPlatform() === 'ios';

  const isLikelyCameraPhoto = useMemo(() => {
    return (file: File) => {
      return (
        isIos && file.name === 'image.jpg' && file.type.startsWith('image/')
      );
    };
  }, [isIos]);

  const validExtensions =
    /\.(pdf|gif|jpg|jpeg|bmp|tif|tiff|png|mp4|mov|wmv|avi|mp3|doc|docx|xls|xlsx|txt|ppt|pptx|dwg|eml|msg|sldprt|sldasm|iam|ipt|cad|jpe|jif|rar|zip|7z)$/i;
  const thumbs = files.map((file) => (
    <Box p={1} className={classes.thumb} key={file.name}>
      <Box className={classes.thumbInner}>
        <img src={file.preview} className={classes.img} />
      </Box>
    </Box>
  ));

  const validateFileExtension = (fileName: any) => {
    return validExtensions.test(fileName);
  };
  const uploadFile = (index: number) => {
    if (files[index]) {
      setHiddenProgress(false);
      const fileName = rootPath.concat(
        randomName
          ? `${uuidv4()}.${files[index].name.split('.').pop()}`
          : files[index].name,
      );

      const newFiles = [...files];
      newFiles[index].fileName = fileName;
      setFiles(newFiles);

      const code = rootPath.substring(
        rootPath.indexOf('/') + 1,
        rootPath.lastIndexOf('/'),
      );

      if (code === 'null') {
        if (validateFileExtension(fileName)) uploadFile(index + 1);
        else {
          setHiddenProgress(true);
          setFiles([]);
          dispatch(mainError({ msg: t('FILE_NOT_ALLOWED') }));
        }
      } else {
        DB('companies.s3_object_post', { name: fileName }, (res: IRpc) => {
          const { result } = res;
          if (result && result.success) {
            s3UploadFile(result.data, index);
          } else if (result) {
            setHiddenProgress(true);
            setFiles((newFiles) => {
              newFiles.splice(index, 1);
              return newFiles;
            });
            dispatch(mainError({ msg: t(result.message) }));
          }
        });
      }
    } else {
      onUpload && onUpload(files);
      setHiddenProgress(true);
    }
  };

  const s3UploadFile = (data: any, index: number) => {
    const fd = new FormData();
    const url = 'https://'.concat(data.bucket, '.', data.host, '/');

    fd.append('key', data.key);
    fd.append('bucket', data.bucket);
    fd.append('acl', data.acl);
    fd.append('success_action_status', '200');
    fd.append('x-amz-credential', data.credential);
    fd.append('x-amz-algorithm', 'AWS4-HMAC-SHA256');
    fd.append('x-amz-date', data.date);
    fd.append('Policy', data.policy);
    fd.append('x-amz-signature', data.signature);
    fd.append('file', files[index]);

    const request = new XMLHttpRequest();

    request.addEventListener('loadend', () => {
      function myTimer() {
        uploadFile(index + 1);
      }
      setTimeout(myTimer, 500);
    });
    request.open('POST', url, true);
    request.send(fd);
  };

  return (
    <GlobalDrawer
      openDrawer={open}
      setOpenDrawer={onClose}
      title={t('LOAD_FILE')}
      content={
        <>
          <Box
            className={clsx(classes.dropzone, 'qa-drop-file-upload')}
            p={1}
            {...rootProps}
          >
            <input {...getInputProps()} />
            <Box p={2} fontSize={10} style={{ padding: 0 }}>
              <Icon
                variantName="upload"
                color={theme.palette.text.secondary}
                size="xxlarge"
              />
            </Box>
            <Box p={2} fontSize={16}>
              {t('DROP_FILE_IMPORT_TOOLTIP')}
            </Box>
            <Box p={2} fontSize={16}>
              <Button variant="contained" title={t('ADD')} />
            </Box>
          </Box>
          <aside className={classes.thumbsContainer}>{thumbs}</aside>
        </>
      }
      actions={
        <>
          {files.length > 0 && hiddenProgress && (
            <Button
              className="qa-btn-submit-image"
              fullWidth
              type="submit"
              icon="upload"
              onClick={() => uploadFile(0)}
              title={t('UPLOAD')}
            />
          )}
          {!hiddenProgress && <CircularProgress size={24} />}
        </>
      }
    />
  );
};

export default FileUpload;
