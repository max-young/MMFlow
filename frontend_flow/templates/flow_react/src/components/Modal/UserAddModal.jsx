import React from 'react';
import ReactModal from 'react-modal';

class UserAddModal extends React.Component {
  render () {
    return (
      <ReactModal 
        isOpen={this.props.showModal}
      >
        {this.props.content}
      </ReactModal>
    );
  }
}

export default UserAddModal;