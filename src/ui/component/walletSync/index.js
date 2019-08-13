// @flow
import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  doCheckSync,
  doGetSync,
  doSetDefaultAccount,
  doSyncApply,
  selectHasSyncedWallet,
  selectGetSyncIsPending,
  selectSetSyncIsPending,
  selectSyncApplyIsPending,
  selectSyncApplyErrorMessage,
  selectSyncData,
  selectSyncHash,
  selectUser,
} from 'lbryinc';
import { doNotifySyncWallet } from 'redux/actions/app';
import { selectWalletIsEncrypted } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
// import { } from 'lbry-redux';

import WalletSync from './view';

const select = (state, props) => ({
  user: selectUser(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  hasSyncedWallet: selectHasSyncedWallet(state),
  getSyncIsPending: selectGetSyncIsPending(state),
  setSyncIsPending: selectSetSyncIsPending(state),
  syncApplyIsPending: selectSyncApplyIsPending(state),
  syncApplyErrorMessage: selectSyncApplyErrorMessage(state),
  syncData: selectSyncData(state),
  syncHash: selectSyncHash(state),
  walletEncrypted: selectWalletIsEncrypted(state),
});

const perform = dispatch => ({
  syncApply: (hash, data, password) => dispatch(doSyncApply(hash, data, password)),
  getSync: password => dispatch(doGetSync(password)),
  checkSync: () => dispatch(doCheckSync()),
  setDefaultAccount: () => dispatch(doSetDefaultAccount()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  syncWalletModal: () => dispatch(doNotifySyncWallet()),
});

export default connect(
  select,
  perform
)(WalletSync);
