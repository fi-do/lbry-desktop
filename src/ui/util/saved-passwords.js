import keytar from 'keytar';
import { AUTH_ORG } from 'constants/keychain';

export const setPass = (key, value) => {
  keytar.setPassword(AUTH_ORG, key, value);
};

export const getPass = key => keytar.getPassword(AUTH_ORG, key).then(p => p);

export const deletePass = key => keytar.deletePassword(AUTH_ORG, key).catch(e => console.log(e));
