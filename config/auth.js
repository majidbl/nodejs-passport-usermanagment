module.exports = {
  islogged:function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }else{
      req.session.sessionFlash = {
        type: 'danger',
        message: `Please log in to view that resource`
        
      };
      res.redirect('/users/login');
    }
  },
  loggin: function(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.sessionFlash = {
        type: 'danger',
        message: `You Are Not Authenticated.`
        
      };
      return next();
    }
    res.redirect('/dashboard');      
  }
};