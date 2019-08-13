// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import keytar from 'keytar';

type Props = {
  closeModal: () => void,
  hasSyncedWallet: boolean,
  syncData: string,
  syncHash: string,
  syncApply: (hash: string, data: string, password: string) => void,
  setClientSetting: (string, any) => void,
};

type State = {
  password: string,
};

class ModalWalletSync extends React.PureComponent<Props, State> {
  state = {
    password: '',
  };

  // if password is saved, just do it.
  componentDidMount() {
    keytar.getPassword('LBRY', 'wallet_password').then(p => {
      if (p || p === '') {
        this.setState({ password: p });
      }
    });
  }

  componentDidUpdate() {
    const { props, state } = this;

    // if (state.submitted) {
    //   if (props.walletEncryptSucceded === true) {
    //     props.closeModal();
    //     props.updateWalletStatus();
    //   } else if (props.walletEncryptSucceded === false) {
    //     // See https://github.com/lbryio/lbry/issues/1307
    //     this.setState({ failMessage: 'Unable to encrypt wallet.' });
    //   }
    // }
  }

  onChangePassword(event: SyntheticInputEvent<*>) {
    this.setState({ password: event.target.value });
  }

  onSyncApply() {
    const { syncHash, syncData, syncApply } = this.props;

    syncApply(syncHash, syncData, this.state.password);
  }

  render() {
    const { closeModal } = this.props;

    const { password } = this.state;
    console.log(password);
    return (
      <Modal
        isOpen
        title={__('Sync Wallet')}
        contentLabel={__('Sync Wallet')}
        type="confirm"
        shouldCloseOnOverlayClick={false}
        confirmButtonLabel={__('Sync')}
        abortButtonLabel={__('Exit')}
        onConfirmed={() => this.onSyncApply()}
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.onSyncApply()}>
          <FormField
            autoFocus
            label={__('Wallet Password')}
            type="password"
            name="wallet-password"
            onChange={event => this.onChangePassword(event)}
            value={password}
          />
        </Form>
      </Modal>
    );
  }
}

// error={walletUnlockSucceded === false ? 'Incorrect Password' : false}

export default ModalWalletSync;
