// @flow
import React, { useEffect, useState } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import keytar from 'keytar';
import * as SETTINGS from 'constants/settings';

type Props = {
  user: {},
  syncEnabled: boolean,
  hasSyncedWallet: boolean,
  getSyncIsPending?: boolean,
  // setSyncIsPending?: boolean,
  // syncApplyIsPending?: boolean,
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
};

function WalletSync(props: Props) {
  const {
    user,
    syncEnabled,
    hasSyncedWallet,
    getSyncIsPending,
    // setSyncIsPending,
    syncApplyIsPending,
    syncApplyErrorMessage,
    syncData,
    syncHash,
    syncApply,
    // getSync,
    checkSync,
    setDefaultAccount,
    setClientSetting,
    walletEncrypted,
    syncWalletModal,
  } = props;

  const [passwordSaved, setPassword] = useState(null);
  const [syncStarted, setSyncStarted] = useState(false);
  const enableSync = !syncEnabled;

  useEffect(() => {
    checkSync();
  }, []);

  useEffect(() => {
    keytar.getPassword('LBRY', 'wallet_password').then(p => {
      if (p || p === '') {
        setPassword(p);
      }
    });
  }, []);
  //If we tried (syncStarted and no longer pending)
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
        console.log(`syncing unencrypted wallet with pass ${passwordSaved}, hash ${syncHash} and data ${syncData}`);
        setSyncStarted(true);
        syncApply(syncHash, syncData, '');
      } else if (walletEncrypted && (passwordSaved || passwordSaved === '')) {
        console.log(`syncing encrypted with pass ${passwordSaved}, hash ${syncHash} and data ${syncData}`);
        setSyncStarted(true);
        syncApply(syncHash, syncData, passwordSaved);
      } else if (walletEncrypted && !passwordSaved) {
        console.log('do the sync password modal');
        syncWalletModal();
      }
    } else {
      console.log('that');
      setClientSetting(SETTINGS.ENABLE_SYNC, false);
    }
  }

  // function onSyncEnable() {
  //   const enableSync = !syncEnabled;
  //   if (enableSync) {
  //     onSyncApply();
  //   }
  //   setClientSetting(SETTINGS.ENABLE_SYNC, enableSync);
  // }
  const isEmailVerified = user && user.primary_email && user.has_verified_email;
  return (
    <section className="card card--section">
      <h2 className="card__title">{__('Wallet Sync')}</h2>
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
          onChange={onSyncApply}
          label={__('Enable Sync')}
        />
        {!hasSyncedWallet && <h2>Not synced</h2>}
        {hasSyncedWallet && <h2>Wallet synced</h2>}
        <h2>{String(syncEnabled)}</h2>
      </div>
    </section>
  );
}

export default WalletSync;
