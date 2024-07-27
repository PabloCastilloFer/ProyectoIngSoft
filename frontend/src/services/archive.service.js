import axios from './root.service.js';

export async function getArchive(Url) {
  try {
    console.log(Url)
    const res = await axios.get(Url, { responseType: 'arraybuffer' });
    return res.data;
  } catch (error) {
    console.error('Error fetching archive:', error);
    throw error; // Propaga el error para manejarlo en el componente si es necesario
  }
};