import axios from 'axios'
import { BING } from '../../config/config'
import HttpError from '../error/httpError';

const VIRTUAL_EARTH_END_POINT = 'http://dev.virtualearth.net/REST/V1/Routes'

export const getDistance = async (wp1: string, wp2: string) => {
  const res = await axios.get(VIRTUAL_EARTH_END_POINT, {
    params: {
      'wp.1': wp1,
      'wp.2': wp2,
      key: BING.KEY,
    },
  });

  try {
    return res.data['resourceSets'][0]['resources'][0]['travelDistance'];
  } catch (err) {
    throw new HttpError(400, '변환할 수 없는 주소');
  }
}