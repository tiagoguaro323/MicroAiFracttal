/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { SignIn } from 'view/Auth';
import Main from 'layouts/Main';
import Ai from 'view/Ai/Ai';
import PrivateComponent from './PrivateComponent';

const Routers = React.memo(() => {

  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            <PrivateComponent>
              <Ai />
            </PrivateComponent>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateComponent>
              <Ai />
            </PrivateComponent>
          }
        />
      </Route>
      <Route path="/signin/:oauthredirect?" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
});

export default Routers;
