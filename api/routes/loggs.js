const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Logg = require('../models/logg');
const moment = require('moment');

var today = moment().startOf('day');


router.get('/', (req, res, next) =>{
    Logg.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
    });
});
router.get('/:userId', (req, res, next) =>{
    const id = req.params.userId;
    Logg.find().where({'userid': id })
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
    });
});

router.get('/:userId/:days', (req, res, next) =>{
    var today = moment().startOf('day');
    console.log("ee");
    const id = req.params.userId;
    const days =req.params.days;
    Logg.aggregate(
        [
            { $match : { userid : id }},
            {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  WaterSum: {
                    $sum: "$water"
                  }
                }
              }
        ],
      )
    .exec()
    .then(docs => {
        jsonObj = [];
        realDays = [];
        var new_date = moment(docs[0]._id);
        var count = 0;
        for(var i = 0; i<docs.length;i++) {
            realDays.push(today.diff(moment(docs[i]._id), 'days'));
            console.log(moment(docs[i]._id));
            console.log(today.diff(moment(docs[i]._id), 'days'));
        }
        realDays.sort();
        for(var i = 0; i<days;i++) {
            new_date = moment(today, "DD-MM-YYYY").subtract(i-1, 'days');
            if(count<realDays.length){
                if(i == realDays[count]){
                    
                    jsonObj.push({
                        'id': new_date,
                        'water': docs[count].WaterSum
                    });
                    count = count + 1;

                } else{
                    jsonObj.push({
                        'id': new_date,
                        'water': 0
                    });
                }
            }else{
                jsonObj.push({
                    'id': new_date,
                    'water': 0
                });
            } 
        }
        res.status(200).json(jsonObj);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) =>{
    const dateStr = Date.now();
    console.log(req.body.id)
	const logg = new Logg({
        _id: new mongoose.Types.ObjectId(),
		userid: req.body.id,
		date: dateStr,
		water: req.body.water
	});
	logg.save()
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err);
	});
	res.status(201).json({
		message: 'Made new logg',
		userCreated: logg
	});
});

router.delete('/:loggId', (req, res, next) =>{
	const id = req.params.loggId;
	Logg.remove({_id: id})
	.exec()
	.then(result =>{
	res.status(200).json(result);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
});

module.exports = router;