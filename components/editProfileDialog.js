import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from '../styles/Home.module.css';

export default function EditProfileDialog({ userId, currUsername, openCallback, isOpen }) {
  const [usernameValue, setUsernameValue] = React.useState(currUsername);

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
      <AccountCircleIcon className={styles.center} onClick={handleClickOpen}/>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={currUsername}
            onChange={handleTextInput}
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