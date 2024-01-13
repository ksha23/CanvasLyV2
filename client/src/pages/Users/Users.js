import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import moment from 'moment';

import { getUsers } from '../../store/actions/usersActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
// import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

const Users = ({ getUsers, users: { users, isLoading } }) => {
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="dark:text-white">
        <h1 className="text-center text-3xl font-bold">Users</h1>
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center w-full max-w-4xl">
              <Loader />
            </div>
          ) : (
            <>
              {users.map((user, index) => {
                return (
                  <div key={index} className="flex space-x-6 mb-4">
                    {/* <Link to={`/${user.username}`}> */}
                    <div className="w-40 h-40">
                      <img src={user.avatar} className="object-cover w-full h-full" />
                    </div>
                    {/* </Link> */}
                    <div className="info-container">
                      <div>
                        <span className="font-bold">Provider: </span>
                        <span className="info">{user.provider}</span>
                      </div>
                      <div>
                        <span className="font-bold">Role: </span>
                        <span className="info">{user.role}</span>
                      </div>
                      <div>
                        <span className="font-bold">Name: </span>
                        <span className="info">{user.name}</span>
                      </div>
                      <div>
                        <span className="font-bold">Username: </span>
                        {/* <Link to={`/${user.username}`} className="info bold profile-link"> */}
                        <span className="info">{user.username}</span>
                        {/* </Link> */}
                      </div>
                      <div>
                        <span className="font-bold">Email: </span>
                        <span className="info">{user.email}</span>
                      </div>
                      <div>
                        <span className="font-bold">Joined: </span>
                        <span className="info">
                          {moment(user.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default compose(requireAdmin, connect(mapStateToProps, { getUsers }))(Users);
