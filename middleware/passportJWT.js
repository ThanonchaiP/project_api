const config = require('../config/index');
const Admin = require('../models/admin');
const Teacher = require('../models/teacher');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        //check ว่าเป็น admin or teacher
        let user = null;console.log(jwt_payload.role)
        if(jwt_payload.role === 'admin'){
            user = await Admin.findById(jwt_payload.id);
        }else if(jwt_payload.role === 'teacher'){
            user = await Teacher.findById(jwt_payload.id);
        }

        if(!user){
            return done(new Error('ไม่พบผู้ใช้ในระบบ'),null); //done ก็เหมือน next ใน express
        }

        return done(null,user); //user จะเเนบไปกับ req

    } catch (error) {
      done(error);
    }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false });