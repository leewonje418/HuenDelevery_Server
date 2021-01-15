import axios from 'axios';
import { GOOGLE } from '../../config/config';

const GOOGLE_END_POINT = 'https://maps.googleapis.com/maps/api/geocode/json';

export const convertToAddress = async (lat: number, long: number) => {
  const res = await axios.get(GOOGLE_END_POINT, {
    params: {
      latlng: encodeURI(`${lat},${long}`),
      key: GOOGLE.KEY,
      language: 'ko'
    },
  })

  return res.data['results'][0]['formatted_address'];
}