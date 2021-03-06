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


export default function Home() {

  const [media, setMedia] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [detail, setItem] = React.useState(null);
  const [data, setData] = useState([])
  const DEZ_MINUTOS = 600000; 

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

  const init = () => {

    /* aqui é somente a media dos ultimos 20 pedidos */
    var fbMedia = firebase.database().ref('cadastro').orderByChild("pronto").equalTo(true).limitToLast(20);
    fbMedia.on("value", function(snapshot){

      var listMedia = [];
      var obj = {};

      snapshot.forEach((childSnapshot) => {
        obj = childSnapshot.val();
        listMedia.push(new Date(obj.pedidoPronto).getTime() - new Date(obj.date).getTime());
      });

      if(listMedia.length){
        var totalMedia = listMedia.reduce((a,b) => a + b, 0) / listMedia.length;
        console.log(listMedia);
        setMedia(totalMedia);
      }
    });

    /* pega todos os pedidos */
    var fb = firebase.database().ref('cadastro');
    fb.on("value", function(snapshot){

      var list = [];
      var obj = {};

      snapshot.forEach((childSnapshot) => {
        obj = childSnapshot.val();
        obj.key = childSnapshot.key;
        list.push(obj);
      });

      setData(Object.values(list).reverse());
    });
  }

  /* carrega as informacoes dos pedidos */
  useEffect(() => {

    init();

    setInterval(() => {
      init();
    }, 10000);

  }, []);

  return (
    <div className={styles.container}>

      <Head>
        <title>Papila Rappi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <strong>MONITOR DE PEDIDOS</strong>
        <strong>COCKTIME</strong>
      </header>
      
      <main className={styles.main}>

        <div className={styles.wrapperPedidos}>
          <div className={styles.timeCocking}>
            <p className={styles.timeCockingText}>{msToTime(media)}</p>
          </div>

          <div className={styles.pedidosContainer}>
            <div className={styles.pedidos}>
              {

                data.filter(item => !item.pedidoPronto && (new Date().getTime() - new Date(item.date).getTime() > DEZ_MINUTOS)).map((item, index) => {
                  return (<div key={index} className={styles.pedido}>
                    <p className={styles.orderId}><strong>{item.sequential.toString().slice(-4)}</strong></p>
                    <small>{msToTime(new Date().getTime() - new Date(item.date).getTime())}</small>
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
