import { React, useState } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { Home, Person } from '@mui/icons-material';
import ProfileMenu from './ProfileMenu';

const NavBar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, width: '100%' }}>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <Button style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0 .25rem', borderRadius: '1rem' }}> <Home style={{ marginRight: '.25rem' }} /> Trang chủ</Button>
            </ButtonGroup>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <ProfileMenu style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0.5rem .5rem', borderRadius: '5rem' }} onClick={toggleProfileMenu}> <Person /> </ProfileMenu>
            </ButtonGroup>
        </div>
    );
};

export default NavBar;