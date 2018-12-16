const express = require('express');
const cors = require('cors');
const mysql = require ('mysql');
const request = require('request');
const axios = require('axios');

axios.get('https://api.themoviedb.org/3/discover/movie?api_key=4fba833d14a0e854b19fc2ba5dc2f8bc&language=en-US&sort_by=popularity.asc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31')
.then(response=> {
    console.log(response.data.url);
    console.log(response.data.explanation);
})
.catch(error =>{
    console.log(error);
})

const app = express();

const SELECT_ALL_PRODUCTS_QUERY ='SELECT* FROM movies2'

const connection = mysql.createConnection({
    host: '159.89.131.130',
    user:'rooter',
    password: 'Target00',
    database :'CARS'
});

connection.connect(err=>{
    if(err ){
        return err;
    }
})

app.use(cors());

app.get('/',(req, res)=>{
    connection.query(SELECT_ALL_PRODUCTS_QUERY,(err, results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    })
});
app.get('/pro/add',(req, res)=>{
    const {id,name,year} =req.query;
    const INSERT_PRODUCTS_QUERY = `INSERT INTO movies2(id,name,year) VALUES('${id}','${name}','${year}');`;
    connection.query(INSERT_PRODUCTS_QUERY,(err, results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.send('successfully added')
        }
    })
});
app.listen(4000,()=>{
    console.log('Products server listening on port 4000')
});