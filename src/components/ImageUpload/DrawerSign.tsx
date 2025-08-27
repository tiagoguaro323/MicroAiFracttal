import React, { FC, useCallback, useRef, useState } from 'react';
import { GlobalDrawer, ModalLoading } from 'fracttal-core';
import { Box } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import SignaturePad from 'react-signature-pad-wrapper';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { IRpc } from 'core/services/RequestRpc';
import DB from 'core/services/DB';
import { mainError } from 'store/main/actions';
import { Button, ButtonIcon } from 'designSystem';

interface IProps {
  rootPath: string;
  onUpload: (files: any[]) => void;
  onClose: () => void;
}

const DrawerSign: FC<IProps> = ({ rootPath, onUpload, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const signRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const setSignRef: any = useCallback((node: any) => {
    if (node !== null && signRef.current === null) {
      signRef.current = node;
      node.clear();
    }
  }, []);

  const onClear = useCallback(() => {
    signRef.current.clear();
  }, []);

  const getCanvas = useCallback(() => {
    return signRef.current.canvas.current;
  }, []);

  const s3UploadFile = useCallback(
    (data: any) => {
      const fd = new FormData();
      const url = 'https://'.concat(data.bucket, '.', data.host, '/');
      const request = new XMLHttpRequest();

      getCanvas().toBlob((blob: any) => {
        fd.append('key', data.key);
        fd.append('bucket', data.bucket);
        fd.append('acl', data.acl);
        fd.append('success_action_status', '200');
        fd.append('x-amz-credential', data.credential);
        fd.append('x-amz-algorithm', 'AWS4-HMAC-SHA256');
        fd.append('x-amz-date', data.date);
        fd.append('Policy', data.policy);
        fd.append('x-amz-signature', data.signature);
        fd.append('file', blob);

        request.addEventListener('loadend', () => {
          setLoading(false);
          setTimeout(() => {
            onUpload([{ fileName: data.key }]);
          }, 500);
        });
        request.open('POST', url, true);
        request.send(fd);
      });
    },
    [getCanvas, onUpload],
  );

  const uploadFile = useCallback(() => {
    if (!signRef.current.isEmpty()) {
      setLoading(true);
      const fileName = rootPath.concat(`${uuidv4()}.png`);

      DB('companies.s3_object_post', { name: fileName }, (res: IRpc) => {
        const { result } = res;
        if (result && result.success) {
          s3UploadFile(result.data);
        } else if (result) {
          setLoading(false);
          dispatch(mainError({ msg: result.message }));
        }
      });
    } else {
      dispatch(mainError({ msg: t('ALERT_SIGN_REQUIRED') }));
      setLoading(false);
    }
  }, [dispatch, rootPath, s3UploadFile, t]);

  return (
    <GlobalDrawer
      openDrawer
      setOpenDrawer={onClose}
      title={t('SIGNATURE')}
      content={
        <>
          <ModalLoading loading={loading} />
          <Button
            className="qa-signature-clear-btn"
            color="primary"
            variant="outlined"
            onClick={onClear}
            sx={{ width: 100 }}
            title={t('CLEAR')}
          />
          <Box border={1} borderRadius="3px" marginBottom={2} marginTop={2}>
            <SignaturePad ref={setSignRef} redrawOnResize />
          </Box>
        </>
      }
      tools={
        <ButtonIcon
          className="qa-signature-save-btn"
          title={t('SAVE')}
          onClick={uploadFile}
          icon="save"
          variant="contained"
        />
      }
    />
  );
};

export default DrawerSign;
