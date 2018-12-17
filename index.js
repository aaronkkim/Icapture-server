const express = require('express');
const cors = require('cors');
const mysql = require ('mysql');
const request = require('request');

const app = express();
const fields = ['id', 'adult', 'backdrop_path', 'genre_ids', 'original_language', 'original_title', 'overview', 'popularity', 'poster_path', 'release_date', 'title', 'video', 'vote_average', 'vote_count'];
const queryStringParams = fields.map(function() {
    return '?';
});
const queryString = 'insert into movies3(' + fields.join() + ') values (' + queryStringParams + ');';
//console.log(queryString);
const SELECT_ALL_MOVIES_QUERY ='SELECT* FROM movies3'

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


app.get('/display',(req, res)=>{
    connection.query(SELECT_ALL_MOVIES_QUERY,(err, results)=>{
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
app.get('/gather',(req, res)=>{

    request('https://api.themoviedb.org/3/discover/movie?api_key=4fba833d14a0e854b19fc2ba5dc2f8bc&certification_country=US&certification=R&sort_by=vote_average.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2015-12-31&with_genres=878&sort_by=popularity.desc&limit=100',
    {json: true},
    (err, res, body)=>{
        console.log(body.results)
        // Loop over query results, each result is a movie
        body.results.forEach(function(movie) {
           
            let queryData = fields.map(function(d) {
                if(!movie.hasOwnProperty(d)) { // Movie didn't have the field we wanted, return as a string and hope that MySQL doesn't puke because a different column type (BUG)
                    return '';
                } else {
                    if(typeof movie[d] == 'object') { // This field is a complex object, lets just return a JSON string value
                            return JSON.stringify(movie[d]);
                    } else {
                            return typeof movie[d] == 'string' ? movie[d].replace(/[\u0800-\uFFFF]/g, '') : movie[d]; // Clean string of wild characters that MySQL didn't like (POSSIBLE BUG on UTF data think APAC movie titles)
                    }
                }
            });
            
            connection.query(queryString, queryData, function(err,res) {

                if(err) {
                    console.log('error', err); // eslint-disable-line no-console
                }
                console.log("this is the response"+res)
            });
            connection.end();
            
});
    })
})
app.listen(4000,()=>{
    console.log('Movie server listening on port 4000')
});

