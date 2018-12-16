const express = require('express');
const cors = require('cors');
const mysql = require ('mysql');
const request = require('request');
const axios = require('axios');

request('https://api.themoviedb.org/3/discover/movie?api_key=4fba833d14a0e854b19fc2ba5dc2f8bc&certification_country=US&certification=R&sort_by=vote_average.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31&with_genres=878&sort_by=popularity.desc&limit=100',{json:true},(err,res,body)=>{
    if (err){return console.log(err);}
    var movies = body
    console.log(body.results[0].title);
    console.log(body.explanation)
})
//     axios.get('https://api.themoviedb.org/3/discover/movie?api_key=4fba833d14a0e854b19fc2ba5dc2f8bc&certification_country=US&certification=R&sort_by=vote_average.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31&with_genres=878&sort_by=popularity.desc&limit=100')
// .then(response=> {
//     //console.log(response.data)
//    // console.log(response);
//     const results =response.data
//     //console.log(results)
//     var movieRows =[]})
//     .then(results=>{results.forEach((movie)=>{
//         console.log(movie.title+'Hi')
//     })
//     console.log(results)
//     //console.log(response.data.explanation);
// })
// .catch(  (error) => {
//     const response = error.response
//     console.log(response +'error')
//   })
  
  


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
    const{id,adult,backdrop_path,genre_ids,original_language,original_title,overview,popularity,poster_path,release_date,title,video,vote_average,vote_count} = req.query;
    const INSERT_PRODUCTS_QUERY = `INSERT INTO movies3(id,adult,backdrop_path,genre_ids,original_language,original_title,overview,popularity,poster_path,release_date,title,video,vote_average,vote_count) 
    VALUES('${id}','${adult}','${backdrop_path}','${genre_ids}','${original_language}','${original_title}','${overview}','${popularity}','${poster_path}','${release_date}','${title}','${video}','${vote_average}','${vote_count}');`;
    request('https://api.themoviedb.org/3/discover/movie?api_key=4fba833d14a0e854b19fc2ba5dc2f8bc&certification_country=US&certification=R&sort_by=vote_average.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31&with_genres=878&sort_by=popularity.desc&limit=100',{json:true},(err,res,body)=>{
    if (err){return console.log(err);}
    var movies = body.results[0]
    console.log(body.results[0].title);
    console.log(body.explanation)
})
    connection.query(INSERT_PRODUCTS_QUERY,(err, movies)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.send('successfully added')
        }
    })
});
app.listen(4000,()=>{
    console.log('Movie server listening on port 4000')
    // console.log(getMovies())
});