import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from '../styles/Home.module.css';
import { signOut } from "next-auth/react"


export default function EditProfileDialog({ userId, currUsername, openCallback, isOpen }) {
  const [usernameValue, setUsernameValue] = React.useState(currUsername);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    openCallback(true);
  };
  const handleClose = () => {
    openCallback(false);
  };

  const updateUserName = async (userId, usernameValue) => {
    await fetch('/api/user/updateUsername', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        username: usernameValue,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handleSave = () => {
    if (checkValidUsername(usernameValue)) {
      // Call username backend function
      updateUserName(userId, usernameValue);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      handleClose(false);
    }
  }

  const handleTextInput = (e) => {
    setUsernameValue(e.target.value);
  }

  const checkValidUsername = (username) => {
    // TODO: profanity filter
    if (username.length <= 0) return false;
    return true;
  };

  return (
    <div>
      <AccountCircleIcon 
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        className={styles.center} 
        onClick={handleMenuClick}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickOpen}>Change Username</MenuItem>
        <MenuItem onClick={() => {
          localStorage.clear();
          signOut();
        }}>Logout</MenuItem>
      </Menu>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Change Username"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={currUsername}
            onChange={handleTextInput}
            inputProps={{ maxLength: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
