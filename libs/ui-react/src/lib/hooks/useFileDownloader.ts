import { useCallback, useState } from 'react';

import { useAppConfig, useUser } from '../contexts';
// import { NewSubmissionDocument, SubmissionDocument } from '@curi-com-services/submission-input-common';

import downloadFile from '../components/documents/downloadFile';

export function useFileDownloader() {
  const [, { getAuthToken }] = useUser();
  const appConfig = useAppConfig();
  const apiUrl = appConfig.data?.apiUrl;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = useCallback(
    async (doc: any) => {
      if (!apiUrl || isLoading) {
        return;
      }

      try {
        setError(null);
        const authToken = await getAuthToken();
        if (!authToken) {
          throw new Error('Failed to get auth token');
        }

        setIsLoading(true);
        await downloadFile(doc, apiUrl, authToken);
      } catch (err) {
        console.error('Failed to download file', err);
        setError('Failed to download file');
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, getAuthToken, isLoading]
  );

  return {
    downloadFile: handleDownload,
    error,
    isLoading,
  };
}
