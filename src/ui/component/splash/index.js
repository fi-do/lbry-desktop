import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectDaemonVersionMatched, selectModal } from 'redux/selectors/app';
import { doCheckDaemonVersion, doNotifyUnlockWallet, doHideModal } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SplashScreen from './view';
import { doWalletUnlock } from 'lbry-redux';
import {
  doCheckSync,
  doSyncApply,
  selectHasSyncedWallet,
  selectSyncApplyIsPending,
  selectSyncApplyErrorMessage,
  selectSyncData,
  selectSyncHash,
} from 'lbryinc';

const select = state => ({
  modal: selectModal(state),
  daemonVersionMatched: selectDaemonVersionMatched(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  syncData: selectSyncData(state),
  syncHash: selectSyncHash(state),
});

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
  notifyUnlockWallet: () => dispatch(doNotifyUnlockWallet()),
  hideModal: () => dispatch(doHideModal()),
  unlockWallet: password => dispatch(doWalletUnlock(password)),
});

export default connect(
  select,
  perform
)(SplashScreen);
