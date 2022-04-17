const Category = require('../models/Category');
const Activity = require('../models/Activity');
const Feature = require('../models/Feature');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Image = require('../models/Image');
const Users = require('../models/Users');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const bcrypt = require("bcryptjs");
const fs = require('fs-extra');
const path = require("path");

module.exports = {
    viewSignin: (req, res) => {
        try {
            
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            if (req.session.user == null || req.session.user == undefined) {
                res.render('index.ejs', { 
                    alert,
                    title : 'Login | Staycation'
                 });
            }else{
                console.log('abgkhvswghkevgbhrea');
                res.redirect('/admin/dashboard');
            }
        } catch (error) {
            res.redirect('/login');
        }
    },
    actionSignin: async (req, res) => {
        const {username, password} = req.body;
        try {
            const user = await Users.findOne({username: username});
            if (!user ) {
                req.flash('alertMessage', `User tidak ditemukan`);
                req.flash('alertStatus', 'danger');
                res.redirect('/admin');
            }


            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                req.flash('alertMessage', `User tidak ditemukan`);
                req.flash('alertStatus', 'danger');
                res.redirect('/admin');
            }

            req.session.user = {
                id : user.id,
                username : user.username
            };
            res.redirect('/admin/dashboard');
            
        } catch (error) {
            console.log(error);
            res.redirect('/admin');
        }
    },
    actionLogout: async (req, res) => {
        try {
            req.session.destroy();
            res.redirect('/admin');
            
        } catch (error) {
            res.redirect('/admin/dashboard');
        }
    },


    viewDashboar: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};


            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find();
            res.render('admin/dashboard/index.ejs', { 
                alert,
                title : 'Staycation | Dashboard',
                user: req.session.user,
                member,
                booking,
                item,
             });
        } catch (error) {
            res.redirect('/dashboard');
        }
    },


    viewCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            res.render('admin/category/index.ejs', { 
                categories,
                alert,
                title : 'Staycation | Category',
                user: req.session.user
             });
        } catch (error) {
            res.redirect('/admin/category');
        }
    },
    addCategory: async (req, res) => {
        try {
            const {name} = req.body;
            // console.log(name);
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    editCategory: async (req, res) => {
        try {
            const {id, name} = req.body;
            const category = await Category.findByIdAndUpdate(id, {name: name});
            req.flash('alertMessage', 'Success Update Category!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const {id} = req.params;
            const category = await Category.findByIdAndDelete(id);
            req.flash('alertMessage', 'Success Delete Category!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },


    viewBank: async (req, res) => {
        try {
            const banks = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            res.render('admin/bank/index.ejs', {
                title : 'Staycation | Bank',
                alert,
                banks,
                user: req.session.user
            });
        } catch (error) {
            res.redirect('/admin/category');
        }
    },
    addBank: async (req, res) => {
        try {
            const {name, bank, nomorrekeneing} = req.body;
            // console.log(req.file);
            await Bank.create({
                nameBank : bank,
                nomorRekening: nomorrekeneing,
                name: name,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            const {id, bank , name, rekening } = req.body;
            var image = '';
            const bankUpdate = await Bank.findByIdAndUpdate(id, {
                name: name,
                nameBank: bank,
                nomorRekening: rekening
            });
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/${bankUpdate.imageUrl}`));
                bankUpdate.imageUrl = `images/${req.file.filename}`;
                await bankUpdate.save();
            }
            req.flash('alertMessage', 'Success Update Bank!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const {id} = req.params;
            const bank = await Bank.findByIdAndDelete(id);
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            req.flash('alertMessage', 'Success Delete Bank!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            const categories = await Category.find();
            const items = await Item.find()
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name'});
            res.render('admin/item/index.ejs', {
                title : 'Staycation | Items',
                categories,
                items,
                alert ,
                action: 'view',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem: async (req, res) => {
        try {
            const {id} = req.params;
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            const items = await Item.findById(id)
                .populate({ path: 'imageId', select: 'id imageUrl' });
            console.log(items.imageId);
            res.render('admin/item/index.ejs', {
                title : 'Staycation | Image Items',
                items,
                alert ,
                action: 'show image',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const {title, price, city , categoryId, description} = req.body;
            // console.log(req.files);
            const category = await Category.findById(categoryId);
            const newItem = {
                categoryId : category._id,
                title,
                description,
                price,
                city
            }
            const item = await Item.create(newItem);
            category.itemId.push({_id: item._id});
            category.save();
            if (req.files.length > 0) {
                const img = req.files;
                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({
                        imageUrl : `images/${req.files[i].filename}`
                    });
                    item.imageId.push({_id: imageSave._id})
                    await item.save()
                }
                // img.forEach(async (gambar)  => {
                //     console.log(gambar.filename);
                //     const imageSave = await Image.create({
                //         imageUrl : `images/${gambar.filename}`
                //     });
                //     item.imageId.push({_id: imageSave._id})
                //     await item.save()
                // });
            }
            req.flash('alertMessage', 'Success Add Item!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
            
        } catch (error) {
            if (req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
                }
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showEditItem: async (req, res) => {
        try {
            const {id} = req.params;

            const items = await Item.findById(id)
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name'});
            const categories = await Category.find();
            // console.log(items);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            res.render('admin/item/index.ejs', {
                title : 'Staycation | Edit Items',
                categories,
                items,
                alert ,
                action: 'edit',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    editItem: async (req, res) => {
        try {
            const {id} = req.params;
            const {title, price, city , categoryId, description} = req.body;
            const item = await Item.findById(id)
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name'});


            if (req.files.length > 0) {
                console.log(item.imageId.length);
                console.log(req.files.length);
                for (let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findById(item.imageId[i]);
                    // console.log(imageUpdate);
                    var filenya = path.join(`public/${imageUpdate.imageUrl}`);
                    if (fs.existsSync(filenya)) {
                        await fs.unlink(filenya);
                    } else {
                        console.log("DOES NOT exist:", filenya);
                    }
                    console.log(req.files[i]);
                    if (req.files[i] != undefined) {
                        imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                        await imageUpdate.save();
                    }else{
                        console.log('delete : ', item.imageId[i]._id);
                        imageUpdate.remove();
                    }
                }

            }else{
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = description;
                item.categoryId = categoryId;
                await item.save();
            }

            req.flash('alertMessage', `Success Update Item ${item.title}!`);
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            if (req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
                }
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    deleteItem: async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findById(id).populate('imageId');
            console.log(item);
            item.imageId.forEach(async(imaged) => {
                // console.log(imaged);
                await Image.findById(imaged.id);
                await fs.unlink(path.join(`public/${imaged.imageUrl}`));
                imaged.remove();
            });
            item.remove();
            req.flash('alertMessage', 'Success Delete Item!');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },

    viewDetailItem: async (req, res) => {
        const {id} = req.params;

        try {
            const features = await Feature.find({itemId: id});
            const activities = await Activity.find({itemId: id});
            // console.log(features);
            // console.log(activities);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alertActive = req.flash('alertActive');
            const alert = {message : alertMessage, status : alertStatus, activ : alertActive};
            res.render('admin/item/detail/detail.ejs', {
                title : 'Staycation | Detail Items',
                alert ,
                itemId : id ,
                features,
                activities,
                action: 'detail',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${id}`);
        }
    },

    addFeature: async (req, res) => {
        const {name, qty, id} = req.body;
        console.log(id);
        
        try {

            if (!req.file) {
                req.flash('alertMessage', 'Tidak ada File!');
                req.flash('alertStatus', 'danger');
                req.flash('alertActive', `feature`);
                res.redirect(`/admin/item/detail/${id}`);
            }

            const feature = await Feature.create({
                name,
                qty,
                itemId: id,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findById(id);
            item.featureId.push({_id: feature.id});
            item.save();
            req.flash('alertMessage', 'Success Add Feature!');
            req.flash('alertStatus', 'success');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${id}`);
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${id}`);
        }
    },
    editFeature: async (req, res) => {
        const {name, qty, id, itemId} = req.body;
        try {
            var image = '';
            const feature = await Feature.findByIdAndUpdate(id, {
                name: name,
                qty: qty,
            });
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();
            }
            req.flash('alertMessage', `Success Update feature ${feature.name}!`);
            req.flash('alertStatus', 'success');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${feature.itemId}`);
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        const {id, item} = req.params;
        try {
            const feature = await Feature.findById(id);
            const items = await Item.findById(item);
            console.log(feature.id);
            items.featureId.pull(id);
            await items.save()
            try {
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
            } catch (error) {
                console.log('image not found');
            }
            await feature.remove()
            req.flash('alertMessage', `Success Delete feture ${feature.name}!`);
            req.flash('alertStatus', 'success');
            req.flash('alertActive', `feature`);
            res.redirect(`/admin/item/detail/${feature.itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertActive', `feature`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail/${item}`);
        }
    },


    /// Activity
    addActivity: async (req, res) => {
        const {name, type, id} = req.body;
        console.log(id);
        
        try {

            if (!req.file) {
                req.flash('alertMessage', 'Tidak ada File!');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/detail/${id}`);
            }

            const activity = await Activity.create({
                name,
                type,
                itemId: id,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findById(id);
            item.activityId.push({_id: activity.id});
            item.save();
            req.flash('alertMessage', 'Success Add Actifity!');
            req.flash('alertActive', `activity`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/detail/${id}`);
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertActive', `activity`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail/${id}`);
        }
    },
    editActivity: async (req, res) => {
        const {name, qty, id, itemId} = req.body;
        try {
            var image = '';
            const activity = await Activity.findByIdAndUpdate(id, {
                name: name,
                qty: qty,
            });
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.imageUrl = `images/${req.file.filename}`;
                await activity.save();
            }
            req.flash('alertMessage', `Success Update activity ${activity.name}!`);
            req.flash('alertStatus', 'success');
            req.flash('alertActive', `activity`);
            res.redirect(`/admin/item/detail/${activity.itemId}`);
        } catch (error) {
            if (req.file != undefined) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertActive', `activity`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        const {id, item} = req.params;
        try {
            const activity = await Activity.findById(id);
            const items = await Item.findById(item);
            console.log(activity.id);
            items.activityId.pull(id);
            await items.save()
            try {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
            } catch (error) {
                console.log('image not found');
            }
            await activity.remove()
            req.flash('alertMessage', `Success Delete activity ${activity.name}!`);
            req.flash('alertStatus', 'success');
            req.flash('alertActive', `activity`);
            res.redirect(`/admin/item/detail/${activity.itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertActive', `activity`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail/${item}`);
        }
    },


    
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
            .populate('memberId').populate('bankId');
            // console.log(booking);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            res.render('admin/booking/index.ejs', {
                title : 'Staycation | Booking',
                alert,
                user: req.session.user,
                bookings : booking
            });
        } catch (error) {
            console.log(error);
            res.redirect('/admin/booking')
        }
    },

    showBooking: async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findById(id)
            .populate('memberId').populate('bankId');
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            res.render('admin/booking/detail.ejs', {
                title : 'Staycation | detail Booking',
                user: req.session.user,
                booking : booking,
                alert
            });
        } catch (error) {
            console.log(error);
            res.redirect('/admin/booking')
        }
    },
    actionConfirmation : async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findById(id);
            booking.payments.status = 'Accept';
            booking.save();
            req.flash('alertMessage', `Success Booking Confirmation!`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/admin/booking/${id}`);
        }
    },
    actionReject : async (req, res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findById(id);
            booking.payments.status = 'Reject';
            booking.save();
            req.flash('alertMessage', `Success Reject Booking!`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/admin/booking/${id}`);
        }
    },
    
}