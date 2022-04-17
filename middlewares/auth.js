const isLogin = (req, res, next)=>{
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', `Silahkan Login terlebih dahulu`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin');
    }else{
        next();
    }
}

module.exports = isLogin;