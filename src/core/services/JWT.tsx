/* eslint-disable import/order */
import { jwtDecode } from 'jwt-decode';
import rpc from 'core/services/Backend';
import moment from 'moment';
import axios from 'axios';

const HOST = import.meta.env.VITE_APP_URL_API || '';

export default abstract class JWT {
  public static loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!JWT.getToken() && !JWT.isTokenExpired(); // handwaiving here
  }

  public static isTokenExpired() {
    try {
      const token = JWT.getToken(); // Getting token from localstorage
      const decoded: any = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      }

      // Validar si se debe renovar el token
      const expDate = moment.unix(decoded.exp);
      const currentDate = moment();

      // Si faltan menos de 2 horas para expirar
      if (currentDate.add(2, 'hours') > expDate) {
        // Renovar token
        axios({
          method: 'post',
          url: `${HOST}/rpc/auth/renew`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          this.setToken(response.data as string);
        });
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  public static setToken(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    rpc.connect(idToken);
  }

  public static getToken(): string {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token') || '';
  }

  public static logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    rpc.disconnect();
  }

  public static getProfile() {
    // Using jwt-decode npm package to decode the token
    return jwtDecode(JWT.getToken());
  }

  public static jwtDecode(jwt: string) {
    return jwtDecode(jwt);
  }
}
