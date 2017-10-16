import fetch from 'node-fetch';
import uuidV1 from 'uuid/v1';

import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';

import config from '../config';


const getAccess = async ({ login, password }) => {
  const response = await fetch('https://auth.selcdn.ru/', {
    headers: {
      'X-Auth-User': login,
      'X-Auth-Key': password,
    },
  });

  const access = {
    token: response.headers._headers['x-auth-token'][0],
    url: response.headers._headers['x-storage-url'][0],
  };

  return access;
};

const compress = async (image) => {
  const base64Data = image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  const bufferData = Buffer.alloc(base64Data.length, base64Data, 'base64');

  const compressedBuffer = await imagemin.buffer(bufferData, {
    plugins: [
      imageminJpegRecompress(),
      imageminPngquant({ quality: '65-80' }),
    ],
  });

  return compressedBuffer;
};

const selectelUpload = async ({ token, url }, { container, buffer, ext }) => {
  const imageName = `${uuidV1()}.${ext}`;

  const res = await fetch(`${url}${container}/${imageName}`, {
    method: 'PUT',
    headers: {
      'X-Auth-Token': token,
      'Content-Lenght': buffer.length,
    },
    body: buffer,
  });

  if (res.status === 201) {
    return `${url + container}/${imageName}`;
  }
  throw new Error(res.statusText);
};

export const uploadImage = async ({ data, type }) => {
  if (!data || !type) {
    return null;
  }

  let access;
  let buffer;
  let url;

  try {
    access = await getAccess(config.storage);
    buffer = await compress(data);
    url = await selectelUpload(access, {
      container: config.storage.container,
      buffer,
      ext: type.split('/').pop(),
    });
  } catch (e) {
    throw e;
  }

  return url;
};
