import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function NewUserDialog({ newAccount, userId }) {
  const [open, setOpen] = React.useState(newAccount);
  const [usernameValue, setUsernameValue] = React.useState("");

  React.useEffect(() => {
    setOpen(newAccount);
  }, [newAccount]);

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

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    if (checkValidUsername(usernameValue)) {
      console.log('set username to', usernameValue)
      // Call username backend function
      updateUserName(userId, usernameValue);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      setOpen(false);
    }
  };

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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set a Username</DialogTitle>
        <DialogContent sx={{ width: 300}}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="email"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 10 }}
            onChange={handleTextInput}
          />
        </DialogContent>
        <DialogActions style={{ 'align-items': 'start', 'justify-content': 'center' }}
         sx={{ width: 300, height: 90 }}>
          <Button onClick={handleClose}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}