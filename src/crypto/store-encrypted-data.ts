import { Abortable, AsyncTask, IAbortableOptions, IAsyncTaskFactory } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task/types/async-task-constraint.type';

// https://bradyjoslin.com/blog/encryption-webcrypto/

export interface ICreatePasswordCryptoKeyOptions extends IAbortableOptions {
  password: string;
}

export function createPasswordCryptoKey(
  {
    password,
    abortable,
  }: ICreatePasswordCryptoKeyOptions,
): AsyncTask<CryptoKey> {
  return AsyncTask.fromFactory(() => {
    return crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
  }, abortable);
}

/*---*/

export interface IDerivePasswordCryptoKeyOptions extends IAbortableOptions {
  key: CryptoKey;
  salt: Uint8Array;
  keyUsages?: Extract<KeyUsage, 'encrypt' | 'decrypt'>[];
}

export function derivePasswordCryptoKey(
  {
    key,
    salt,
    keyUsages = ['encrypt', 'decrypt'],
    abortable,
  }: IDerivePasswordCryptoKeyOptions,
): AsyncTask<CryptoKey> {
  return AsyncTask.fromFactory(() => {
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      key,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      keyUsages,
    );
  }, abortable);
}

/*---*/

export interface ICreatePasswordCryptoKeyForEncryptionOptions extends ICreatePasswordCryptoKeyOptions, Omit<IDerivePasswordCryptoKeyOptions, 'key'> {
}

export function createPasswordCryptoKeyForEncryption(
  options: ICreatePasswordCryptoKeyForEncryptionOptions,
): AsyncTask<CryptoKey> {
  return createPasswordCryptoKey(options)
    .successful((key: CryptoKey, abortable: Abortable): AsyncTask<CryptoKey> => {
      return derivePasswordCryptoKey({
        ...options,
        key,
        abortable,
      });
    });
}

/*---*/

export interface IEncryptDataUsingPasswordOptions extends Omit<ICreatePasswordCryptoKeyForEncryptionOptions, 'salt' | 'keyUsages'> {
  data: any,
}

export function encryptDataUsingPassword(
  {
    data,
    ...options
  }: IEncryptDataUsingPasswordOptions,
): AsyncTask<Uint8Array> {
  const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));

  return createPasswordCryptoKeyForEncryption({
    ...options,
    salt,
    keyUsages: ['encrypt'],
  })
    .successful((key: CryptoKey, abortable: Abortable) => {
      return AsyncTask.fromFactory(() => {
        return crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          new TextEncoder().encode(
            JSON.stringify(data),
          ),
        );
      }, abortable);
    })
    .successful((buffer: ArrayBuffer) => {
      const data: Uint8Array = new Uint8Array(buffer);

      const encrypted: Uint8Array = new Uint8Array(
        salt.byteLength + iv.byteLength + data.byteLength,
      );

      encrypted.set(salt, 0);
      encrypted.set(iv, salt.byteLength);
      encrypted.set(data, salt.byteLength + iv.byteLength);

      return encrypted;
    });
}

/*---*/

export interface IDecryptDataUsingPasswordOptions extends Omit<ICreatePasswordCryptoKeyForEncryptionOptions, 'salt' | 'keyUsages'> {
  encrypted: Uint8Array;
}

export function decryptDataUsingPassword(
  {
    encrypted,
    ...options
  }: IDecryptDataUsingPasswordOptions,
): AsyncTask<any> {
  const salt: Uint8Array = encrypted.slice(0, 16);
  const iv: Uint8Array = encrypted.slice(16, 16 + 12);
  const data: Uint8Array = encrypted.slice(16 + 12);

  return createPasswordCryptoKeyForEncryption({
    ...options,
    salt,
    keyUsages: ['decrypt'],
  })
    .successful((key: CryptoKey, abortable: Abortable) => {
      return AsyncTask.fromFactory(() => {
        return crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv,
          },
          key,
          data,
        );
      }, abortable);
    })
    .successful((buffer: ArrayBuffer): any => {
      return JSON.parse(new TextDecoder().decode(buffer));
    });
}

/*---*/

export function uint8ArrayToBase64(
  data: Uint8Array,
): string {
  return btoa(String.fromCharCode.apply(null, data));
}

export function base64ToUint8Array(
  data: string,
): Uint8Array {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
}

/*---*/

export interface IStoreEncryptedData extends IEncryptDataUsingPasswordOptions {
  key: string;
}

export function storeEncryptedData(
  {
    key,
    ...options
  }: IStoreEncryptedData,
): AsyncTask<void> {
  return encryptDataUsingPassword(options)
    .successful((buffer: Uint8Array): void => {
      localStorage.setItem(key, uint8ArrayToBase64(buffer));
    });
}

export interface IRetrieveEncryptedData extends Omit<IDecryptDataUsingPasswordOptions, 'encrypted'> {
  key: string;
}

export function retrieveEncryptedData(
  {
    key,
    ...options
  }: IRetrieveEncryptedData,
): AsyncTask<any | undefined> {
  const data: string | null = localStorage.getItem(key);
  if (data === null) {
    return AsyncTask.void(options.abortable);
  } else {
    return decryptDataUsingPassword({
      ...options,
      encrypted: base64ToUint8Array(data),
    });
  }
}

export interface IStoreEncryptedData extends IAbortableOptions {
  key: string;
}

export function clearEncryptedData(
  {
    key,
    abortable,
  }: IStoreEncryptedData,
): AsyncTask<void> {
  return AsyncTask.fromFactory(() => {
    localStorage.removeItem(key);
  }, abortable);
}

/*---*/

export interface IRetrieveOrGenerateEncryptedDataOptions<GValue extends IAsyncTaskConstraint<GValue>> extends IRetrieveEncryptedData {
  dataFactory: IAsyncTaskFactory<GValue>;
}

export function retrieveOrGenerateEncryptedData<GValue extends IAsyncTaskConstraint<GValue>>(
  {
    dataFactory,
    ...options
  }: IRetrieveOrGenerateEncryptedDataOptions<GValue>,
): AsyncTask<GValue> {
  return retrieveEncryptedData(options)
    .successful((data: GValue | undefined, abortable: Abortable) => {
      if (data === void 0) {
        return AsyncTask.fromFactory(dataFactory, abortable)
          .successful((data: GValue, abortable: Abortable): AsyncTask<GValue> => {
            return storeEncryptedData({
              ...options,
              data,
              abortable,
            })
              .successful(() => data);
          });
      } else {
        return data;
      }
    });
}
