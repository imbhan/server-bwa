const Tresure = require("../models/Activity");
const Treveler = require("../models/Booking");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Bank = require("../models/Bank");
const fs = require('fs-extra');
const path = require("path");
const Member = require("../models/Member");
const Booking = require("../models/Booking");



module.exports = {
    landingPage: async (req, res)=>{
        try {
            const mostPicked = await Item.find().select('_id title city country price unit').limit(5).populate({path: 'imageId', select: 'id imageUrl'})
            const treveler = await Treveler.find();
            const tresure = await Tresure.find();
            const city = await Item.find();

            const category = await Category.find().select('_id name').limit(3)
            .populate({
                path: 'itemId', 
                select: '_id title city country isPopular imageId',
                populate: {
                    path: 'imageId',
                    select: 'id imageUrl',
                    perDocumentLimit: 1
                },
                perDocumentLimit: 4,
                option : {sort: {sumBooking: -1}},
            })

            
            // category.forEach(async (categori) =>{
            //     categori.itemId.forEach(async (item) =>{
            //         const data_item = await Item.findById(item.id);
            //         data_item.isPopular = false;
            //         await data_item.save();
            //         if (categori.itemId[0] == item) {
            //             data_item.isPopular = true;
            //             await data_item.save();
            //         }
            //     });
            // });

            for (let i = 0; i < category.length; i++) {
                for (let x = 0; x < category[i].itemId.length; x++) {
                    const item = await Item.findById(category[i].itemId[x].id);
                    item.isPopular = false;
                    await item.save();
                    if (category[i].itemId[0] === category[i].itemId[x]) {
                        // console.log(category[i].itemId[x].id);
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }


            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }


            
            res.status(200).json({
                hero: {
                    travelers: treveler.length,
                    treasures: tresure.length,
                    cities: city.length
                },
                mostPicked,
                category,
                testimonial
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'internal server error!'});
        }

    },

    detailPage: async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findById(id)
                .populate({path: 'imageId', select: 'id imageUrl'})
                .populate({path: 'featureId', select: 'id imageUrl qty name'})
                .populate({path: 'activityId', select: 'id imageUrl type name'})


            const bank = await Bank.find()

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'internal server error!'});
        }
    },

    bookingPage: async (req, res) => {
        try {
            // price,
            const { duration, idItem, bookingDateStart , bookingDateEnd , firstName, lastName, email , phoneNumber, accountHolder , bankFrom,  } = req.body;

            if (!req.file) {
                return res.status(405).json({message : 'Image not fount!'});
            }
            
            if (duration === "" || idItem === ""  || bookingDateStart  === "" || bookingDateEnd  === "" || firstName === "" || lastName === "" || email  === "" || phoneNumber === "" || accountHolder  === "" || bankFrom === "" || duration === undefined || idItem === undefined  || bookingDateStart  === undefined || bookingDateEnd  === undefined || firstName === undefined || lastName === undefined || email  === undefined || phoneNumber === undefined || accountHolder  === undefined || bankFrom === undefined ) {
                if (req.file != undefined) {
                    await fs.unlink(path.join(`public/images/${req.file.filename}`));
                }
                return res.status(406).json({message : 'lengkapi semua data'});
            }
            
            const item = await Item.findById(idItem);
            if (!item) {
                return res.status(407).json({message : 'Item tidak ditemukan'});
            }
            
            item.sumBooking += 1
            await item.save();

            let total = item.price * duration;
            let tax = total*0.10;
            const invoice = Math.floor(1000000 + Math.random()*9000000);


            const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber,
            });

            const newBooking = {
                invoice,
                bookingStartDate: bookingDateStart,
                bookingEndDate: bookingDateEnd,
                total : total += tax,
                itemId: {
                    _id: idItem,
                    title: item.title,
                    price: item.price,
                    duration: duration,

                },
                memberId: member.id,
                payments: {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom: bankFrom,
                    accountHolder: accountHolder,
                }
            }

            const booking = await Booking.create(newBooking);

            if (!booking) {
                return res.status(408).json({message : 'Gagal Buat Booking'});
            }

            res.status(200).json({ message: 'Success booking', booking });

        } catch (error) {
            console.log(error);
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            res.status(500).json({message: 'internal server error!'});
        }
    },

    cobaPost : async (req, res) => {
        console.log('coba post');
        res.status(200).json({ message: 'Success coba'});
    }



}