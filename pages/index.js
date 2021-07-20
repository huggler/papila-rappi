import React, { useEffect, useState } from "react";

import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {firebase} from '../services/firebase';
import { format, formatDistance, formatRelative, formatDistanceStrict, differenceInMinutes, subDays } from 'date-fns';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

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

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }

  const [data, setData] = useState([]);

  useEffect(() => {

    var fb = firebase.database().ref('cadastro');
    fb.on("value", function(snapshot){

      var list = [];
      var obj = {};

      snapshot.forEach((childSnapshot) => {
        obj = childSnapshot.val();
        obj.key = childSnapshot.key;
        list.push(obj);
      });

      // var _data = snapshot.val();
      console.log(list);

      setData(Object.values(list).reverse());
    });
  }, [])


  const handleChangeRemoverPedido = (item) => {
    console.log(item);
    var fb = firebase.database().ref('cadastro/' + item.key).remove();
  }

  const handleChangeCozinhaPronto = (item) => {
    console.log(item);
    var fb = firebase.database().ref('cadastro/' + item.key).set({
      ...item,
      cozinhaPronto: new Date().getTime()
    });
  }

  const handleChangeMotoBoyPronto = (item) => {
    console.log(item);
    var fb = firebase.database().ref('cadastro/' + item.key).set({
      ...item,
      pedidoPronto: new Date().getTime()
    });
  }


  return (
    <div className={styles.container}>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {detail?.sequential?.toString()?.slice(-4)} - {detail?.user?.name}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {
          detail?.products?.map((item, index) => {
            return (<Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {item.name} - {item.quantity} - {item.total}
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                  {
                    item?.modifiers?.map((item, index) => {
                      return (<p key={item.id}>{item.name} - {item.quantity} - {item.price.actualPrice}</p>)
                    })
                  }
                  </div>
                </AccordionDetails>
              </Accordion>
            )
          })
        }


        <fieldset>
          <legend>Entrega</legend>
          <div>
            <p>{detail?.address?.address}, {detail?.address?.number}, {detail?.address?.complement} - {detail?.address?.district}</p>
            <p>{detail?.address?.city}, {detail?.address?.state} - {detail?.address?.zip}</p>
          </div>
        </fieldset>


        <iframe height="100%" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBllHqjRcICnCi4czZ-h5yLxNrwObT48cI&q=${detail?.address?.address},{detail?.address?.number}&center=${detail?.address?.latlng?.lat},${detail?.address?.latlng?.lng}`} />

      </Dialog>

      <Head>
        <title>Papila Rappi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <strong>MONITOR DE PEDIDOS</strong>
      </header>
      <main className={styles.main}>





      <table className={styles.table}>
        <thead className={styles.table}>
          <tr>
            <th>
              Pedido
            </th>
            <th>
              Entrada
            </th>
            <th hidden>
              Pedido Cozinha repassou
            </th>
            <th hidden>Demorou</th>
            <th>
              Pronto
            </th>
            <th hidden>
              Media de tudo
            </th>
            <th>
              Nome Cliente
            </th>
            <th>
              Telefone
            </th>
            <th>
              E-mail
            </th>
            <th hidden>
            </th>
            <th hidden>
            </th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
      {
        data.map((item, index) => {
          return (<tr key={index}>
            <td>{index+1} - <strong>{item.sequential.toString().slice(-4)}</strong></td>
            <td>{format(new Date(item.date), 'dd/MM/yyyy HH:mm:ss')}</td>
            <td hidden>{item.cozinhaPronto && (format(item.cozinhaPronto, 'dd/MM/yyyy HH:mm:ss'))}</td>
            <td hidden>{item.cozinhaPronto && (msToTime(new Date(item.cozinhaPronto) - new Date(item.date).getTime()))}</td>
            <td><strong>{item.pedidoPronto && (msToTime(new Date(item.pedidoPronto) - new Date(item.date).getTime()))}</strong></td>
            <td hidden></td>
            <td>{item.user.name}</td>
            <td><a href={`tel:${item.user.phone}`} target="_blank">{item.user.phone}</a></td>
            <td><a href={`mailto:${item.user.email}`} target="_blank">{item.user.email}</a></td>
            <td hidden><button type="button" onClick={() => handleChangeCozinhaPronto(item)}>cozinha avisando atendimento que está pronto</button></td>
            <td hidden><button type="button" onClick={() => handleChangeMotoBoyPronto(item)}>atendimento avisando motoboy que esta pronto</button></td>
            <td><IconButton type="button" onClick={() => handleClickOpen(item)}><EditIcon /></IconButton></td>

          </tr>)
        })
      }
      </tbody>
      </table>
      </main>

      <footer className={styles.footer}>
      feito com ❤ por PAPILA DELI
      </footer>
    </div>
  )
}
