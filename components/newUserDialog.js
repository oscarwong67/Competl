import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styles from '../styles/Home.module.css';

export default function NewUserDialog({ newAccount }) {
  const [open, setOpen] = React.useState(newAccount);

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
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