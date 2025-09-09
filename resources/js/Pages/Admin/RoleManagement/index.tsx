import React from 'react'
import Layout from '../../../CustomLayouts';
import { Head } from '@inertiajs/react';

const RoleManagement = () => {
  return (
    <React.Fragment>
      <Head title='Role Management' />
      <div className="page-content">
        <h1>Role Management</h1>
      </div>
    </React.Fragment>
  )
}

RoleManagement.layout = (page: any) => <Layout children={page} />;
export default RoleManagement
