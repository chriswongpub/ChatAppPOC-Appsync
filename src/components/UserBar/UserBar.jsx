import React from 'react';
import PropTypes from 'prop-types';

import './UserBar.css';

const UserBar = ({ name, team, signout }) => (
  <div className='topbar'>
    <nav className='navbar navbar-bbb bg-primary'>
      <div className='navbar-brand'>
        {/* <span className={'mr-2 text-' + (registered ? 'squidink' : 'light')}>
          <i className={(registered ? 'fas' : 'far') + ' fa-user-circle'} />
        </span> */}
        <span className={'mr-2 text-squidink'}>
          <i className={'fas fa-user-circle'} />
        </span>
        <span> {name} - {team} </span>
      </div>
      <div className='d-flex flex-grow-1'>
        <button className='btn btn-sm btn-squidink ml-auto' onClick={signout}>
          Sign Out
        </button>
      </div>
    </nav>
  </div>
);

UserBar.propTypes = {
  name: PropTypes.string,
  registered: PropTypes.bool,
  signout: PropTypes.func.isRequired
};

export default UserBar;
