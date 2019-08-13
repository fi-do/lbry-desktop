import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalWalletSync from './view';
import { doSyncApply, selectSyncData, selectSyncHash } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';

const select = state => ({
  syncData: selectSyncData(state),
  syncHash: selectSyncHash(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  syncApply: (hash, data, password) => dispatch(doSyncApply(hash, data, password)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(ModalWalletSync);
