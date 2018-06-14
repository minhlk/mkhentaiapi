var ObjectID = require('mongodb').ObjectID;
const cheerio = require('cheerio');
var request = require('request');
var cloudscraper = require('cloudscraper');
module.exports = (app, db) => {

    // app.post('/notes', (req, res) => {
    //     const note = { title: req.body.title };
    //     // console.dir(dtb);
    //     // dtb = dtb.db("hentaimkapi");
    //     db.collection('notes').insert(note, (err, result) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(result.ops[0]);
    //         }
    //     });
    // });


    // app.get('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };

    //     db.collection('notes').findOne(details, (err, item) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(item);
    //         }
    //     });

    // });
    // app.delete('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     db.collection('notes').remove(details, (err, item) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send('Note ' + id + ' deleted!');
    //         }
    //     });
    // });

    // app.put('/notes/:id', (req, res) => {
    //     const id = req.params.id;
    //     const details = { '_id': new ObjectID(id) };
    //     const note = { title: req.body.title };
    //     db.collection('notes').update(details, note, (err, result) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             res.send(note);
    //         }
    //     });
    // });
    function parseMovies(page) {
        url = process.env.MOVIES_LIST+'/page/' + (page + 1);
        // console.log(url);
        return new Promise((resolve, reject) => {
            cloudscraper.get(url, function (error, response, body) {
                if (error) {
                    console.log('Error occurred at page ' + page);
                    reject(error);
                }
                else {
                    var $ = cheerio.load(body);
                    var items = [];
                    $('.container .row .block a').each(function (i, elem) {
                        img = $(this).children('img');
                        items.push({
                            image: img.attr('src'),
                            title: $(this).attr('title'),
                            url: $(this).attr('href'),
                            status: $(this).prev().text(),
                            pos: i,
                            page: page

                        });
                        // parseMoviesDetails($(this).attr('href')).then((rs) => {
                            // items[i].episodes = rs;
                            // console.log(items[i]);
                        // },(err) => {
                        //     console.log( err);
                        // });
                    });

                    resolve(items);
                }

            })
        })

    }

    // function parseMoviesDetails(url) {
    //     // title = title.split(' ').join('-');
    //     // title = '/anime-hentai-vietsub-'+title+'/xem-phim.html';
    //     // url = process.env.HOME_URL + title;
    //     url += '/xem-phim.html';
    //     return  new Promise((resolve, reject)=>  {
    //         cloudscraper.get(url, function (error, response, body) {
    //             if (error) {
    //                 console.log('Error occurred ');
    //                 reject(error);
    //                 console.log(url);
    //             }
    //             else {
    //                 var $ = cheerio.load(body);
    //                 var items = [];
    //                 $('.listep a').each(function (i, elem) {
    //                     img = $(this).attr('href');
    //                     items.push(img);
    //                 });
    //                 // return items;
    //                 resolve(items);
    //             }

    //         })
    //     });

    // }

    
    //Update List Movies
    app.get('/refresh-db', (req, res) => {
        url = process.env.MOVIES_LIST;
       
        cloudscraper.get(url, function (error, response, body) {
            if (error) {
                console.log("Can't get html from homepage");
                reject(error);
            } else {
                db.collection('HenList').remove();
                var $ = cheerio.load(body);
                var lastPage = $("a[aria-label='Last Page']").attr('href');
                lastPage = lastPage.substring(lastPage.lastIndexOf('/') + 1, lastPage.length);
                //here
                items = [];
                promises = [];
                console.log(lastPage);
                for (let i = 0; i < lastPage; i++) {
                    promises.push(parseMovies(i));
                }
                Promise.all(promises).then((rs) => {
                    temp = rs.length - 1;
                    console.log(rs.length);
                    rs.forEach( (item,i) => {
                        db.collection('HenList').insert(item, (err, result) => {
                            if (err) {
                                console.log(err);
                                
                            } else {
                                // res.send(result.ops[0]);
                                console.log("success" + i)
                                temp -= 1;
                                if(temp == 0){
                                    res.send('success');
                                }
                                
                            }
                        });
                    })
                    
                }, (err) => {
                    console.log(err);
                })
                // resolve(items);







            }
        });
    });
    //Get list by page
    app.get('/list-movie/:page', (req, res) => {
        const page = req.params.page == null || req.params.page  < 0 ? 0 : req.params.page - 1;
        const item = { 'page': page };
        db.collection('HenList').find(item, {}).sort({pos : 1}).toArray().then(rs => res.send(rs));

    });


    // app.post('/detail-movie/:title', (req, res) => {
         
    //     const item = { '_id': new ObjectID(req.body.id ) };
    //     db.collection('HenList').findOne(item, (err, item) => {
    //         if (err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {


    //             // var $ = cheerio.load(item.body);
    //             // img = '';
    //             // $('li.item').each(function (i, elem) {
    //             //     img = $(this).children('.box-cover img');
    //             //     console.log(img);
    //             // });
    //             console.log(typeof item);
    //             res.send(item);
    //         }


    //     });
    // });

};