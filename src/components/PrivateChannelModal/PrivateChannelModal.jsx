import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './PrivateChannelModal.css';

import SearchUserList from './SearchUserList';

class PrivateChannelModal extends Component {
  state = {
    keyword: ''
  };

  searchUser = (e) => {
    this.setState({
      keyword: e.target.value
    });
  }

  render() {
    let { userId, visible, toggleModal, selectedUsers, select, done } = this.props;

    return(
      <Modal 
        isOpen={visible} 
        toggle={toggleModal} 
        className='modal-container'
      >
        <ModalHeader toggle={toggleModal}>New Private Channel</ModalHeader>
        <ModalBody>
          <form onSubmit={ (e) => e.preventDefault() }>
            Select users for a new channel
            <div className='form-group'>
              <input
                type='text'
                placeholder='Type search keyword here...'
                className='form-control modal-search-input'
                value={this.state.keyword}
                onChange={this.searchUser}
              />
              <SearchUserList 
                userId={userId}
                keyword={this.state.keyword}
                selectedUsers={selectedUsers}
                select={select}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <div className='modal-user-description'>
            {selectedUsers.map(user => user.username).join(',') }
          </div>
          <Button color='primary' onClick={done} disabled={!selectedUsers.length}>DONE</Button>
        </ModalFooter>
      </Modal>
    );
  }  
}

PrivateChannelModal.propTypes = {
  userId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  selectedUsers: PropTypes.array,
  select: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
  userSearchData: PropTypes.object
};

export default PrivateChannelModal;

