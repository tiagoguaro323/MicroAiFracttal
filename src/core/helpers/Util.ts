import { MD5 } from 'crypto-js';

export default {
  encryptPassword({
    email,
    password,
    doubleEncrypt = true,
  }: {
    email: string;
    password: string;
    doubleEncrypt?: boolean;
  }) {
    const pwd = MD5(`${email}:${password}`).toString();
    if (!doubleEncrypt) return pwd;
    return MD5(`${email}:${pwd}`).toString();
  },
};
