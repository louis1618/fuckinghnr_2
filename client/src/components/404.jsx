import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div className="container">
      <Header />
      <div className="main-content">
          <Outlet />
      </div>
    </div>
  );
}

export default Layout;
