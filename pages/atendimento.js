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

  const LIMITE_TEMPO = 600000; 

  const classes = useStyles();

  const [media, setMedia] = useState(0);
  const [pedido, setPedido] = useState('');
  const [data, setData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [detail, setItem] = React.useState(null);

  const handleClickOpen = (item) => {
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
  };

  const init = () => {

    var fb = firebase.database().ref('cadastro');
    fb.on("value", function(snapshot){

      var list = [];
      var obj = {};

      var listMedia = [];

      snapshot.forEach((childSnapshot) => {
        obj = childSnapshot.val();
        obj.key = childSnapshot.key;
        list.push(obj);

        if(obj.pedidoPronto){
          listMedia.push(obj.pedidoPronto);
        }
      });

      var totalMedia = listMedia.reduce((a,b) => a + b, 0) / listMedia.length;
      setMedia(totalMedia);

      setData(Object.values(list).reverse());
    });
  }

  /* carrega as informacoes */
  useEffect(() => {

    init();

    setInterval(() => {
      init();
    }, 10000);

  }, []);

  /* avisa o motoboy que o pedido esta no balcao para retirada */
  const handleSubmitForm = (event) => {

    event.preventDefault();

    if(pedido === ''){
      return false;
    }

    var item = data.find(i => i.sequential.toString().includes(pedido));

    if(!item){
      alert('Pedido não existe na Base');
      setPedido('');
      return false;
    }

    firebase.database().ref('cadastro/' + item.key).set({
      ...item,
      pedidoPronto: new Date().getTime(),
      pronto:true
    }).then(resp => {
      setPedido('');
      document.getElementById('player').play();
    });
  };

  /* motoboy pegou o pedido */
  const handleChangePedidoEntregue = (item) => {
    var fb = firebase.database().ref('cadastro/' + item.key).set({
      ...item,
      pedidoEntregue: new Date().getTime(),
      entregue:true
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Papila Rappi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <strong>AGUARDANDO RETIRADA...</strong>
        <form  className={styles.formPedido} onSubmit={handleSubmitForm}>
          <input value={pedido} placeholder="inserir pedido" id="pedido" onChange={(event) => setPedido(event.target.value)} name="pedido" />
          <button type="submit" className="btnPedido">ok</button> 
        </form>
      </header>

      <audio id="player" controls="controls" hidden>
        <source src="/mixkit-software-interface-back-2575.wav" type="audio/mp3" />
        seu navegador não suporta HTML5
      </audio>


      
      
      <main className={styles.main}>

        <div className={styles.wrapperPedidos}>

          <div className={styles.pedidosContainer}>
            <div className={styles.pedidos}>
              {
                data.filter(item => item.pedidoPronto && !item.pedidoEntregue).map((item, index) => {
                  let AGUARDANDO = new Date().getTime() - new Date(item.pedidoPronto).getTime();
                  return (<div key={index} className={`${(AGUARDANDO > LIMITE_TEMPO) && 'alerta'} ${styles.pedido}`} onClick={() => handleChangePedidoEntregue(item)}>
                    <p className={styles.orderId}><strong>{item.sequential.toString().slice(-4)}</strong></p>
                    <small>{msToTime(AGUARDANDO)}</small>
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