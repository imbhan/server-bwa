const router = require('express').Router();
const adminController = require('../controllers/adminController');
const {upload, uploadMultiple} = require('../middlewares/multer');
const auth = require('../middlewares/auth');


router.get('/', adminController.viewSignin);
router.post('/', adminController.actionSignin);

router.use(auth); 
//harus login

router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDashboar);


router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);


router.get('/bank', adminController.viewBank);
router.post('/bank', upload , adminController.addBank);
router.put('/bank', upload , adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);
 

//item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple , adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/:id', uploadMultiple , adminController.editItem);
router.delete('/item/:id', adminController.deleteItem);


//feature
router.get('/item/detail/:id', adminController.viewDetailItem);
router.post('/item/feature/add', upload ,adminController.addFeature);
router.put('/item/feature/edit', upload ,adminController.editFeature);
router.delete('/item/feature/delete/:id/:item' ,adminController.deleteFeature);

//Activity
router.post('/item/activity/add', upload ,adminController.addActivity);
router.put('/item/activity/edit', upload ,adminController.editActivity);
router.delete('/item/activity/delete/:id/:item' ,adminController.deleteActivity);






router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showBooking);
router.put('/booking/:id/confirm', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);

module.exports = router;