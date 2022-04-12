import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function HelpMenuDialog() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <HelpOutlineIcon className={styles.center} onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle className={styles.center} id="responsive-dialog-title">
          {"How To Play"}
        </DialogTitle>
        <DialogContent 
          sx={{
            width: 326 // Same as mockup width
          }}
        >
          <DialogContentText sx={{ color: '#ffffff' }}>
            Guess today’s secret word in 6 tries. Each guess must be a valid 5 letter word. 
            Hit ENTER to submit. 
            <br/><br/>
            Example
          </DialogContentText>
          <Image 
            src='/../public/help_img.png' 
            alt='Competl guess' 
            width={280} 
            height={50}
          />
          <DialogContentText sx={{ color: '#ffffff' }}>
            I is in the word and in the correct spot.
            R is in the word but in the wrong spot.
            A, T, and E are NOT in the word.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}