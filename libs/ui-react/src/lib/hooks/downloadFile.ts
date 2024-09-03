export async function getDownloadUrlByKey(key: string, apiUrl: string, authToken: string): Promise<string> {
  const signedUrlResponse = await fetch(`${apiUrl}/download?key=${key}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  });

  if (!signedUrlResponse.ok) {
    throw new Error('Failed to get download url');
  }

  const {
    data: { url },
  } = await signedUrlResponse.json();

  return url;
}

export default async function downloadFile(doc: { key: string; name: string }, apiUrl: string, authToken: string) {
  const url = await getDownloadUrlByKey(doc.key, apiUrl, authToken);

  const downloadResponse = await fetch(url);
  if (!downloadResponse.ok) {
    throw new Error('Failed to download file');
  }

  const blob = await downloadResponse.blob();
  downloadFileFromBlob(blob, doc.name);
}

export function downloadFileFromBlob(blob: Blob, name: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = name;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
