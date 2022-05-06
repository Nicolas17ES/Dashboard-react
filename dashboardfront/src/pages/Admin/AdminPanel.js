import React from 'react';
import AddServices from '../../components/Admin/AddService'
import '../Dashboard.css'

const AdminPanel = () => {
    return (
        <div className="admin-panel">
            <AddServices />
        </div>
    );
};

export default AdminPanel;