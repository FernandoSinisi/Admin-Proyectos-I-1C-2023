import React from 'react';
import { useState } from "react"
import {useSession} from "../auth/auth";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Divider, makeStyles } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import {Alert, Box, Collapse, Grid, IconButton, Modal, TextField} from "@mui/material";
import profileService from "../services/profile/profileService";
import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '../img/collage.png'

const useStyles = makeStyles(theme => ({
    root: {
      borderRadius: 12,
      minWidth: 256,
      textAlign: 'center',
    },
    header: {
      textAlign: 'center',
      spacing: 10,
    },
    list: {
      padding: '20px',
    },
    button: {
      margin: theme.spacing(1),
    },
    action: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }));

  const mainDivStyles = {
    display: "flex",
    flexDirection: "column",
    height: "940px",
    padding: 42
  }

  export default function SubscriptionScreen() {
    const session = useSession();
    const classes = useStyles();
    const [subscription, setSubscription] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [openAlertKeep, setOpenAlertKeep] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleSubscription = (subscription) => {
      setSubscription(subscription);

      if (subscription === 'Basic') {
        changeSubscriptionBasic();

        setOpenAlert(true);
      } else {
        setOpenModal(true);
      }
    };

    const handleCloseModal = () => {
      setOpenModal(false);

      changeSubscription();

      setOpenAlert(true);
    };

    const changeSubscription = () => {
      profileService.editProfile({
        userId: session.userId,
        subscription: subscription
      });
    };

    const changeSubscriptionBasic = () => {
      profileService.editProfile({
        userId: session.userId,
        subscription: "Basic"
      });
    };

    const getPrice = () => {
      switch (subscription) {
          case 'Standard':
              return '$ 19.99';
          case 'Premium':
              return '$ 59.99';
          default:
              return '$ 00.00';
      }
  };

  const [prof] = profileService.getProfiles({
    filters: {userId: session.userId}
  })

    return (
        <div style={mainDivStyles}>
          <Collapse in={openAlert}>
              <Alert variant="outlined" severity="success" 
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Subscription changed
            </Alert>
        </Collapse>
        <Collapse in={openAlertKeep}>
              <Alert variant="outlined" severity="info" 
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlertKeep(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Subscription saved 
            </Alert>
        </Collapse>
          <div style={{ padding: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Arial', color: 'black' }}>
            Plans for pet & travel lovers
          </Typography>
        </div>
          <div style={{padding: 20, alignItems: "center", display: 'flex', justifyContent: "space-between"}}>
            <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={12} sm={4}>
                  <Card className={classes.root}>
                    <CardHeader title="Basic Subscription" className={classes.header} />
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.root}>
                        <Typography align="center">Discover why house </Typography>
                        <Typography align="center">sitting works</Typography>
                        <br/>
                      </div>
                        <Typography variant="h4" align="center" style={{ marginTop: 10 }}>
                        Free
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                    {(prof.subscription === "Basic") ?
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => setOpenAlertKeep(true)}
                        value="Basic"
                        name="subscription">
                        Keep basic
                        </Button> : 
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => handleSubscription('Basic')}
                        value="Basic"
                        name="subscription">
                        Get basic
                        </Button>
                    }
                    </CardActions>
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.list}>
                        <Typography align="center">✔ Free use of the website</Typography>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                      </div>
                    </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className={classes.root}>
                    <CardHeader title="Standard Subscription" className={classes.header} />
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.root}>
                          <Typography align="center">Find your ideal sitter fast </Typography>
                          <Typography align="center">or your money back. Plus</Typography>
                          <Typography align="center">enjoy global sits</Typography>
                      </div>
                        <Typography variant="h4" align="center" style={{ marginTop: 10 }}>
                    $ 19.99 /month
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                    {(prof.subscription === "Standard") ?
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => setOpenAlertKeep(true)}
                        value="Standard"
                        name="subscription">
                        Keep standard
                        </Button> : 
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => handleSubscription('Standard')}
                        value="Standard"
                        name="subscription">
                        Buy standard
                        </Button>
                    }
                        </CardActions>  
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.list}>
                        <Typography align="center">✔ Six house sits as a sitter</Typography>
                        <Typography align="center">✔ Six pet & home care</Typography>
                        <Typography align="center">from verified sitters at no </Typography>
                        <Typography align="center">extra cost</Typography>
                      </div>
                    </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className={classes.root}>
                    <CardHeader title="Premium Subscription" className={classes.header} />
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.root}>
                          <Typography align="center">Stress-free travel, </Typography>
                          <Typography align="center">with lounge passes. Plus enjoy </Typography>
                          <Typography align="center">unlimited global sits</Typography>
                      </div>
                        <Typography variant="h4" align="center" style={{ marginTop: 10 }}>
                        $ 59.99 /month
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                    {(prof.subscription === "Premium") ?
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => setOpenAlertKeep(true)}
                        value="Premium"
                        name="subscription">
                        Keep premium
                        </Button> : 
                        <Button variant="contained" color="primary" className={classes.button}
                        style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                        onClick={() => handleSubscription('Premium')}
                        value="Premium"
                        name="subscription">
                        Buy premium
                        </Button>
                    }
                    </CardActions>
                    <Divider variant="middle" />
                    <CardContent>
                      <div className={classes.list}>
                        <Typography align="center">✔ Unlimited house sits as a sitter</Typography>
                        <Typography align="center">✔ Unlimited pet & home care</Typography>
                        <Typography align="center">from verified sitters at no </Typography>
                        <Typography align="center">extra cost</Typography>
                      </div>
                    </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <form onSubmit={handleCloseModal}>
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridAutoRows: 'minmax(50px, auto)',
                  gap: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  alignItems: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid #000',
                  boxShadow: 100,
                  padding: '1rem',
                  width: '50%',
                  maxHeight: '90%',
                }}
              >
                <Typography variant="h6" align="left">
                  Billing details
                </Typography>
                <TextField
                  label="Name"
                  autoFocus
                  style={{ gridColumn: '1' }}
                  required
                />
                <TextField
                  label="Last Name"
                  style={{ gridColumn: '2' }}
                  required
                />
                <TextField
                  label="Country"
                  style={{ gridColumn: '1' }}
                  required
                />
                <TextField
                  label="ZIP / PostCode"
                  InputProps={{
                    inputProps: {
                      pattern: '[0-9]*', // Allow only numbers
                    },
                  }}
                  style={{ gridColumn: '2' }}
                  required
                />
                <TextField
                  helperText="Please enter card numbers"
                  id="demo-helper-text-misaligned"
                  label="Card details"
                  style={{ gridColumn: '1 / span 2' }}
                  required
                />
                <TextField
                  label="MM / YY"
                  helperText="Please enter card expiration date"
                  InputProps={{
                    inputProps: {
                      pattern: '[0-9]*', // Allow only numbers
                    },
                  }}
                  style={{ gridColumn: '1' }}
                  required
                />
                <TextField
                  helperText="Please enter secure card number"
                  id="demo-helper-text-misaligned"
                  label="CVC"
                  style={{ gridColumn: '2' }}
                  required
                />
                <Typography variant="h5" align="left" >
                  Total: {getPrice()}
                </Typography>
                <Button
                  type="submit"
                  value={subscription}
                  style={{
                    gridColumn: '2',
                    backgroundColor: '#6E2CA4E8',
                    alignItems: 'center',
                  }}
                >
                  Pay now
                </Button>
              </Box>
            </form>
          </Modal>
        </div>
    )
}
