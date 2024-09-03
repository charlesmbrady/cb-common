import { useEffect, useState } from 'react';
import { useAppConfig, useSnackbarContext, useUser } from '../contexts';

import { UploadableFile, UploadState } from './types';
import uploadFile from '../components/documents/uploadFile';

export default function useFileUploader(uploadableFile: UploadableFile | null) {
  const { addSnack } = useSnackbarContext();

  const [data, setData] = useState(
    uploadableFile
      ? {
          id: uploadableFile.id,
          key: uploadableFile.key,
        }
      : null
  );
  const [uploadState, setUploadState] = useState(uploadableFile?.uploadState || UploadState.Ready);

  const appConfig = useAppConfig();
  const [, { getAuthToken }] = useUser();

  useEffect(() => {
    if (!uploadableFile) {
      setUploadState(UploadState.Ready);
    }
  }, [uploadableFile]);

  useEffect(() => {
    async function upload(file: UploadableFile, apiUrl: string) {
      setUploadState(UploadState.InProgress);
      try {
        const authToken = await getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get auth token');
        }

        const { key: newKey, id: newId } = await uploadFile(file, apiUrl, authToken);

        setData({ id: newId, key: newKey });
        setUploadState(UploadState.Success);
      } catch (err) {
        console.error('Failed to upload file', err);
        addSnack({
          message: 'An error occurred while uploading a file',
          type: 'error',
        });
        setUploadState(UploadState.Error);
      }
    }

    if (appConfig.data?.apiUrl && uploadableFile && uploadState === UploadState.Ready) {
      upload(uploadableFile, appConfig.data.apiUrl);
    }
  }, [uploadableFile, uploadState, appConfig.data, getAuthToken]);

  return {
    id: data?.id,
    key: data?.key,
    uploadState,
  };
}
