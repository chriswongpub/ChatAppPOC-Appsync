import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import { searchUsers } from 'graphql/queries';

class SearchUserList extends Component {

  render() {
    // if ( !this.props.userSearchData ) return <div />;
    const {
      userSearchData: {
        searchUsers: { items: users = [] } = {}
      },
      selectedUsers,
      select
    } = this.props;

    return (
      <ul className='list-group modal-user-list'>
        { 
          users.map(user => 
            <li key={user.id} className='list-group-item list-group-item-action modal-user-item' onClick={select(user)}>
              <span className='modal-user-item-name'>{user.username}</span>
              { (selectedUsers.findIndex(item => item.id === user.id) !== -1) && <i className='fas fa-check modal-user-item-icon'></i> } 
            </li>
          )
        }
      </ul>
    );

    // return (
    //   <div className='modal-no-users'>
    //     No Search Result
    //   </div>
    // );
  }
}

SearchUserList.propTypes = {
  userId: PropTypes.string,
  keyword: PropTypes.string,
  selectedUsers: PropTypes.array,
  select: PropTypes.func,
  userSearchData: PropTypes.object
};

let graphql_enhancer = compose(
  graphql(searchUsers, {
    name: 'userSearchData',
    skip: props => !props.userId,
    options: props => (
      {
        variables: {
          filter: { username: { regexp: `.*${props.keyword}.*` }, id: { ne: props.userId } }
        },
        fetchPolicy: 'cache-and-network'
      }
    )
  })
);

export default graphql_enhancer(SearchUserList);
