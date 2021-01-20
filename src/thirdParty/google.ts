import axios from 'axios';
import { GOOGLE } from '../../config/config';
import HttpError from '../error/httpError';
import { ILatLong } from '../interface/position.interface';

const GOOGLE_END_POINT = 'https://maps.googleapis.com/maps/api/geocode/json';

export const convertToAddress = async (lat: number, long: number): string => {
  const res = await axios.get(GOOGLE_END_POINT, {
    params: {
      latlng: encodeURI(`${lat},${long}`),
      key: GOOGLE.KEY,
      language: 'ko'
    },
  })

  try {
    return res.data['results'][0]['formatted_address'];
  } catch (err) {
    return `위도: ${lat}, 경도: ${long}`;
  }
}

export const convertToPosition = async (address: string): Promise<ILatLong> => {
  const res = await axios.get(GOOGLE_END_POINT, {
    params: {
      key: GOOGLE.KEY,
      address,
    },
  });

  try {
    const result = res.data['results'][0]['geometry']['location'];

    return {
      lat: result['lat'],
      long: result['lng'],
    };
  } catch (err) {
    throw new HttpError(400, '알 수 없는 주소');
  }
}
