const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Logg = require('../models/logg');
const moment = require('moment');

const today = moment().startOf('day');


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

router.get('/:userId/:date', (req, res, next) =>{
    console.log("ee");
    const id = req.params.userId;
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
        res.status(200).json(docs);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) =>{
    const dateStr = Date.now();
    console.log(dateStr);
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