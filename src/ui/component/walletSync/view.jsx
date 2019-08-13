// @flow
import React, { useEffect, useState } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import keytar from 'keytar';
import * as SETTINGS from 'constants/settings';

type Props = {
  user: {},
  syncEnabled: boolean,
  // hasSyncedWallet: boolean,
  getSyncIsPending?: boolean,
  // setSyncIsPending?: boolean,
  syncApplyIsPending?: boolean,
  syncApplyErrorMessage?: string,
  syncData: string | null,
  syncHash: string | null,
  syncApply: (string | null, string | null, string) => void,
  // getSync: string => void,
  checkSync: () => void,
  setDefaultAccount: () => void,
  setClientSetting: (string, boolean | string) => void,
  walletEncrypted: boolean,
  syncWalletModal: () => void,
  isPasswordSaved: boolean,
};

function WalletSync(props: Props) {
  const {
    user,
    syncEnabled,
    // hasSyncedWallet, // would be nice if we coul
    getSyncIsPending,
    // setSyncIsPending,
    syncApplyIsPending,
    syncApplyErrorMessage,
    syncData,
    syncHash,
    syncApply,
    // getSync,
    checkSync,
    // setDefaultAccount, // we may or may not need to do this
    setClientSetting,
    walletEncrypted,
    syncWalletModal,
    isPasswordSaved,
  } = props;

  const [password, setPassword] = useState(null);
  const [syncStarted, setSyncStarted] = useState(false);
  const enableSync = !syncEnabled;

  useEffect(() => {
    checkSync();
  }, []);

  useEffect(() => {
    keytar.getPassword('LBRY', 'wallet_password').then(p => {
      if (p) {
        setPassword(p);
      } else {
        setPassword('');
      }
    });
  }, [isPasswordSaved]);

  useEffect(() => {
    if (syncStarted && !syncApplyIsPending) {
      console.log('should be good');
      if (!syncApplyErrorMessage) {
        // we good
        setClientSetting(SETTINGS.ENABLE_SYNC, enableSync);
        // probably want to set default wallet now (lbryinc)
      }
    }
  }, [syncApplyIsPending, syncStarted, syncApplyErrorMessage]);

  function onSyncApply() {
    const enableSync = !syncEnabled;
    if (enableSync) {
      console.log('this');
      if (!walletEncrypted) {
        console.log(`syncing unencrypted wallet with pass ${password}, hash ${syncHash} and data ${syncData}`);
        setSyncStarted(true);
        syncApply(syncHash, syncData, '');
      } else if (walletEncrypted && (password || password === '')) {
        console.log(`syncing encrypted with pass ${password}, hash ${syncHash} and data ${syncData}`);
        setSyncStarted(true);
        syncApply(syncHash, syncData, password);
      } else if (walletEncrypted && !isPasswordSaved) {
        console.log('do the sync password modal');
        syncWalletModal();
      }
    } else {
      console.log('that');
      setClientSetting(SETTINGS.ENABLE_SYNC, false);
    }
  }

  const isEmailVerified = user && user.primary_email && user.has_verified_email;
  return (
    <section className="card card--section">
      <h2 className="card__title">
        {__('Wallet Sync')}
        {'  '}
        <span className="badge badge--alert">ALPHA</span>
      </h2>

      <div className="card__content">
        {!isEmailVerified && (
          <p className="card__subtitle">
            {__(`It looks like your email isn't registered yet.`)}{' '}
            <Button button="link" label={__('Register your email')} navigate="/$/auth" />{' '}
            {__(`and then come back here.`)}
          </p>
        )}
        <FormField
          type="checkbox"
          name="sync_enabled"
          checked={syncEnabled}
          disabled={!isEmailVerified || getSyncIsPending}
          error={!!syncApplyErrorMessage && syncApplyErrorMessage}
          helper={!!syncApplyErrorMessage && syncApplyErrorMessage}
          onChange={onSyncApply}
          label={__('Enable Sync')}
        />
        <p className="card__subtitle card__help ">
          {__(
            'You must use the same password as your other devices. You may need to unencrypt and reencrypt using that password above.'
          )}
        </p>
      </div>
    </section>
  );
}

export default WalletSync;
