import { PLATERECOGNIZER_TOKEN } from '../config';

export const recognizePlate = async (base64Image: string) => {
  try {
    const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${PLATERECOGNIZER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upload: base64Image,
        regions: ['tr'], // Türkiye'ye özel tanıma
      }),
    });

    if (!response.ok) {
      throw new Error('Plaka tanıma başarısız.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    return null;
  }
};
