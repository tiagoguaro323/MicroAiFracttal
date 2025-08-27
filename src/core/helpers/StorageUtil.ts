import DB from 'core/services/DB';
import { IRpc } from 'core/services/RequestRpc';

const IMG_DEFAULT =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

export function getBase64Image(url: any) {
  return new Promise((resolver) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx !== null) ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');

      resolver(dataURL);
    };

    img.onerror = () => {
      resolver(IMG_DEFAULT);
    };
    img.src = url;
  });
}

export function signImage(url: any) {
  return new Promise((resolver) => {
    DB('companies.s3_object_get', { name: url }, (res: IRpc) => {
      const { result } = res;
      let signUrl;

      if (result && result.success) signUrl = result.data.url;
      else signUrl = '/images/background-img.png';

      resolver(signUrl);
    });
  });
}

export function imageSize(fileUpload: any) {
  return new Promise<{ height: any; width: any }>((resolver) => {
    const reader = new FileReader();

    // Read the contents of Image File.
    reader.readAsDataURL(fileUpload);
    reader.onload = (e) => {
      // Initiate the JavaScript Image object.
      const image = new Image();

      // Set the Base64 string return from FileReader as source.
      if (e.target) {
        image.src = e.target.result as string;

        // Validate the File Height and Width.
        image.onload = () => {
          resolver({ height: image.height, width: image.width });
        };
      } else {
        resolver({ height: null, width: null });
      }
    };
  });
}
