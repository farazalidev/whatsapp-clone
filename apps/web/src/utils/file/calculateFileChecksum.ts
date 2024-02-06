export const calculateChecksumAwait = (data: Blob | File): Promise<string> => {
  const crypto = window.crypto;

  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const buffer = await crypto.subtle.digest('SHA-256', new Uint8Array(e.target?.result as ArrayBuffer));
        const hashArray = Array.from(new Uint8Array(buffer));
        const checksum = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
        resolve(checksum);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsArrayBuffer(data);
  });
};

export const calculateChecksumPromise = (data: Blob | File) => {
  const crypto = window.crypto;

  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      crypto.subtle
        .digest('SHA-256', new Uint8Array(e?.target?.result as ArrayBuffer))
        .then((buffer) => {
          const hashArray = Array.from(new Uint8Array(buffer));
          const checksum = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
          resolve(checksum);
        })
        .catch((error) => {
          reject(error);
        });
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsArrayBuffer(data);
  });
};
