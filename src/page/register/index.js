import React from 'react';
import { Link , Outlet } from 'react-router-dom';

const Register = () => {
    return (
        <div>
            <h1>Register</h1>
            <Link to="/">Login</Link>
<Outlet/>
        </div>
    );
}

export default Register;
