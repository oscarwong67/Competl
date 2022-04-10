import styles from '../styles/Login.module.css';

import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { signIn, signOut, getProviders, useSession } from "next-auth/react"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs() {
  const { data: session, status } = useSession()
  const [open, setOpen] = React.useState(true);

  // Hardcoded, manually update if adding more providers
  const providers = [GoogleProvider({clientId: process.env.GOOGLE_ID,clientSecret: process.env.GOOGLE_SECRET,}), GithubProvider({clientId: process.env.GITHUB_ID,clientSecret: process.env.GITHUB_SECRET,})];

  const handleClose = () => {
    setOpen(false);
  };

  if (session) {
    return <></>
  }
  return (
    <>
      <div>
        <BootstrapDialog
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Please Sign To Start Competing
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Grid container justify="center" direction="column">
              <div className={styles.loginbtn}>
                <Button
                  variant="outlined"
                  sx={{ color: "white", backgroundColor: "secondary" }}
                  onClick={() =>
                    signIn(providers[0].id, {
                      callbackUrl: `${window.location.origin}/`,
                    })
                  }
                >
                  <GoogleIcon fontSize="large" className={styles.loginicon} />
                  <span className="login-btn-text">
                    Continue with {providers[0].name}
                  </span>
                </Button>
              </div>
              <div className={styles.loginbtn}>
                <Button
                  variant="outlined"
                  sx={{ color: "white", backgroundColor: "secondary" }}
                  onClick={() =>
                    signIn(providers[1].id, {
                      callbackUrl: `${window.location.origin}/`,
                    })
                  }
                >
                  <GitHubIcon fontSize="large" className={styles.loginicon} />
                  <span className="login-btn-text">
                    Continue with {providers[1].name}
                  </span>
                </Button>
              </div>
            </Grid>
          </DialogContent>
        </BootstrapDialog>
      </div>
    </>
  );
}