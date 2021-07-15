import React, { useEffect, useState } from "react";

import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {firebase} from '../services/firebase';


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Home() {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [detail, setItem] = React.useState(null);

  const handleClickOpen = (item) => {

    console.log(item);

    setOpen(true);
    setItem(item)
  };

  const handleClose = () => {
    setOpen(false);
  };  

  const [data, setData] = useState([])

    useEffect(() => {

      var fb = firebase.database().ref('cadastro');
      fb.on("value", function(data){
        var _data = data.val();
        console.log(_data);
        setData(Object.values(_data).reverse());
    });
  }, []);

  return (
    <div className={styles.container}>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {detail?.order_detail?.order_id?.toString()?.slice(-4)}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          {detail?.order_detail?.items?.map((item, index) => {
            return (
            <React.Fragment key={index}>
            <ListItem button>
              <ListItemText primary={item.name} secondary={item.quantity} />
            </ListItem>
            <Divider />
            </React.Fragment>
          )})}

        </List>
      </Dialog>

      <Head>
        <title>Papila Rappi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <img src="/logo-rappi.jpg" className={styles.logotipo} />
      </header>
      
      <main className={styles.main}>

        <div className={styles.wrapperPedidos}>
          <div className={styles.timeCocking}>
            <p>8:00</p>
          </div>

          <div className={styles.pedidosContainer}>
            <div className={styles.pedidos}>
              {
                data.map((item, index) => {
                  return (<div key={index} className={styles.pedido}>
                    <p className={styles.orderId}><strong>{item.order_detail.order_id.toString().slice(-4)}</strong></p>
                  </div>)
                })
              }
            </div>
          </div>
        </div>


      </main>

      <footer className={styles.footer}>
        feito com ❤ por PAPILA DELI
      </footer>
    </div>
  )
}
