!function(e){var r={};function t(s){if(r[s])return r[s].exports;var n=r[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,t),n.l=!0,n.exports}t.m=e,t.c=r,t.d=function(e,r,s){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:s})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(t.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)t.d(s,n,function(r){return e[r]}.bind(null,n));return s},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=25)}([function(e,r){e.exports=require("mongoose")},function(e,r){e.exports=require("express")},function(e,r){e.exports=require("passport")},function(e,r){e.exports=require("path")},function(e,r){e.exports=require("hbs")},function(e,r,t){"use strict";(function(e){t.d(r,"a",function(){return b}),t.d(r,"b",function(){return U});var s=t(1),n=t.n(s),o=t(22),a=t.n(o),i=t(21),u=t.n(i),c=t(4),l=t.n(c),d=t(20),m=t.n(d),p=t(3),g=t.n(p),f=t(10),h=(t(23),t(11)),w=t(16),y=t(12);const v=n()(),b=a.a.createServer(v),U=u()(b);Object(f.a)().catch(e=>console.error("Could not connect to DB",e.message)),l.a.localsAsTemplateData(v),l.a.registerHelper("toJSON",e=>JSON.stringify(e,null,2));const x=m()(l.a);x.registerPartials.bind(x)(g.a.join(e,"../views/partials"),{}),v.set("view engine","hbs"),v.use(w.a),U.on("connection",e=>{console.log("New user connected"),Object(h.a)(e,U)}),v.use((e,r,t)=>{const s=e.flash();r.locals.user=e.user,r.locals.flashes=Object.keys(s).length>0?s:void 0,t()}),v.use("/",y.a)}).call(this,"/Users/tim/Work/misc/complete-node/node-chat-app/server")},function(e,r){e.exports=require("express-validator/check")},function(e,r){e.exports=require("body-parser")},function(e,r){e.exports=require("moment")},function(e,r){e.exports=require("bcrypt")},function(e,r,t){"use strict";var s=t(0),n=t.n(s),o=t(9),a=t.n(o),i=t(19),u=t.n(i),c=t(18),l=t.n(c);const d=new n.a.Schema({email:{type:String,required:"You must supply a email",unique:"An account with email {VALUE} already exists",trim:!0,lowercase:!0,validate:[u.a,"Email is not valid"]},password:{type:String,required:"You must supply a password",trim:!0,minlength:5},username:{type:String,required:"Username is required",unique:"Username already taken",trim:!0}});d.methods={hashPassword(e){if(!e)throw new Error("Password cannot be blank");return a.a.hash(e,12)},isValidPassword(e){return a.a.compare(e,this.password)}},d.pre("save",async function(e){this.password=await this.hashPassword(this.password),e()}),d.plugin(l.a);n.a.model("User",d);r.a=(async()=>n.a.connect(process.env.DB_URL))},function(e,r,t){"use strict";var s=e=>"string"==typeof e&&e.trim().length>0,n=t(8),o=t.n(n);const a=(e,r)=>({from:e,text:r,createdAt:o()().valueOf()});const i=(()=>{let e;const r=()=>new class{constructor(){this.users=[]}addUser(e,r,t){const s={id:e,name:r,room:t};return this.users.push(s),s}removeUser(e){const r=Object.assign({},this.getUser({id:e}));return r&&(this.users=this.users.filter(e=>e.id!==r.id)),r}getUser({id:e,name:r}){return this.users.find(t=>t.id===e||t.name===r)}getUserList(e){return this.users.filter(r=>r.room===e).map(e=>e.name)}getRoomList(){return[...new Set(this.users.map(e=>e.room))]}};return{getInstance:()=>(e||(e=r()),e)}})().getInstance(),u=e=>{e.emit("updateRoomList",{rooms:i.getRoomList()})},c=(e,r)=>e.on("createLocationMessage",t=>{const s=i.getUser({id:e.id});s&&r.to(s.room).emit("newLocationMessage",((e,r,t)=>({from:e,url:`https://www.google.com/maps?q=${r},${t}`,createdAt:o()().valueOf()}))(s.name,t.latitude,t.longitude))});r.a=((e,r)=>({joinRoom:((e,r)=>e.on("join",(t,n)=>{if(!s(t.name)||!s(t.room))return n("Name and Room name are required!");const o=t.name.trim(),c=t.room.trim().toLowerCase(),l=i.getUser({name:o});return l&&l.room===c?n("Username taken!"):(e.join(c),i.removeUser(e.id),i.addUser(e.id,o,c),r.to(c).emit("updateUserList",i.getUserList(c)),e.emit("newMessage",a("Admin",`Welcome to the room ${c}!`)),e.broadcast.to(c).emit("newMessage",a("Admin",`${o} joined the chat`)),u(r),n())}))(e,r),createMessage:((e,r)=>e.on("createMessage",(t,n)=>{const o=i.getUser({id:e.id});o&&s(t.text)&&r.to(o.room).emit("newMessage",a(o.name,t.text)),n()}))(e,r),createLocationMessage:c(e,r),disconnect:((e,r)=>e.on("disconnect",()=>{const t=i.removeUser(e.id);r.to(t.room).emit("updateUserList",i.getUserList(t.room)),r.to(t.room).emit("newMessage",a("Admin",`${t.name} has left`)),u(r)}))(e,r),getRoomList:(e=>e.on("getRoomList",(e,r)=>{r({rooms:i.getRoomList()})}))(e)}))},function(e,r,t){"use strict";var s=t(1),n=t.n(s),o=t(13),a=t(0),i=t.n(a),u=t(6);const c=e=>(r,t,s)=>e(r,t,s).catch(s),l=i.a.model("User"),d=[Object(u.checkSchema)({username:{in:"body",isLength:{errorMessage:"Username must not be empty",options:{min:1}},isAlphanumeric:{errorMessage:"Username must be letters or numbers only"},trim:!0},email:{in:"body",isEmail:{errorMessage:"Email address is not valid"},trim:!0,normalizeEmail:{options:{all_lowercase:!0,gmail_convert_googlemaildotcom:!0,gmail_remove_dots:!0,gmail_remove_subaddress:!0}}},password:{in:"body",isLength:{errorMessage:"Password must be at least 5 characters long",options:{min:5}},trim:!0},"password-confirm":{in:"body",custom:{options:(e,{req:r})=>{if(r.body.password!==e)throw new Error("Password confirmation does not match password field");return!0}}}}),(e,r,t)=>{const s=Object(u.validationResult)(e).formatWith(({msg:e})=>e);s.isEmpty()?t():(e.flash("error",s.array({onlyFirstError:!0})),r.render("signup",{body:e.body,flashes:e.flash()}))}];var m={createOne:async(e,r,t)=>{const{email:s,password:n,username:o}=e.body,a=new l({email:s,password:n,username:o});try{await a.save(),e.login(a,t),e.flash("success","New account created!"),r.redirect("/")}catch(n){if(n.errors){const t=Object.keys(n.errors).map(e=>n.errors[e].message);e.flash("error",t),r.render("signup",{body:{username:o,email:s},flashes:e.flash()})}else t(n)}},getOne:c(async(e,r)=>{const t=await l.findById(e.user.id);r.send(`get user\n ${t}`)}),updateOne:c((e,r)=>{r.send(`update user\n ${e.docFromId}`)}),deleteOne:c((e,r)=>{r.send(`delete user\n ${e.docFromId}`)}),signupForm:(e,r)=>{r.render("signup")},validateNewUser:d};const p=n.a.Router(),g=i.a.model("User");p.param("id",async(e,r,t,s)=>{try{if(!i.a.Types.ObjectId.isValid(s))throw new Error("Invalid user id");const r=await g.findById(s);if(!r)throw new Error("No user found");e.docFromId=r,t()}catch(e){t(e.message)}}),p.route("/signup").get(m.signupForm).post(m.validateNewUser,m.createOne),p.route("/user/:id").get(Object(o.ensureLoggedIn)(),m.getOne).put(m.updateOne).delete(m.deleteOne);var f=t(2);var h={loginForm:(e,r)=>{r.render("login")},loginUser:t.n(f).a.authenticate("local",{successReturnToOrRedirect:"/",failureRedirect:"/login",failureFlash:!0,successFlash:!0}),logoutUser:(e,r)=>{e.logout(),e.flash("info","You have logged out"),r.redirect("/")}};const w=n.a.Router();w.get("/login",h.loginForm),w.post("/login",h.loginUser),w.get("/logout",h.logoutUser);const y=n.a.Router();y.use("/",w),y.use("/",p),y.get("/",(e,r)=>{r.render("index",{title:"Join"})}),y.post("/chat",(e,r)=>{r.render("chat",{title:"Chat"})}),y.use((e,r,t,s)=>{if(!e.errors)return s(e);const n=Object.keys(e.errors);return n.length>0&&n.forEach(t=>r.flash("error",e.errors[t].message)),t.redirect("back")}),y.use((e,r,t,s)=>{t.status(500).send(`something messed up: ${e.message}`)});r.a=y},function(e,r){e.exports=require("connect-ensure-login")},function(e,r){e.exports=require("connect-flash")},function(e,r){e.exports=require("express-session")},function(e,r,t){"use strict";(function(e){var s=t(1),n=t.n(s),o=t(3),a=t.n(o),i=t(7),u=t.n(i),c=t(2),l=t.n(c),d=t(15),m=t.n(d),p=t(14),g=t.n(p);r.a=[n.a.static(a.a.join(e,"../public")),u.a.json(),u.a.urlencoded({extended:!0}),m()({secret:process.env.SESSION_SECRET,resave:!1,saveUninitialized:!1}),l.a.initialize(),l.a.session(),g()()]}).call(this,"/Users/tim/Work/misc/complete-node/node-chat-app/server")},function(e,r){e.exports=require("passport-local")},function(e,r){e.exports=require("mongoose-beautiful-unique-validation")},function(e,r){e.exports=require("validator/lib/isEmail")},function(e,r){e.exports=require("hbs-utils")},function(e,r){e.exports=require("socket.io")},function(e,r){e.exports=require("http")},function(e,r,t){"use strict";var s=t(2),n=t.n(s),o=t(17),a=t.n(o),i=t(0);const u=t.n(i).a.model("User");n.a.use(new a.a({usernameField:"email"},async(e,r,t)=>{try{const s=await u.findOne({email:e});return s&&await s.isValidPassword(r)?t(null,s,{message:`You have logged in, ${s.username}`}):t(null,!1,{message:"User or password is invalid"})}catch(e){return t(e,null,{message:"Could not authenticate. Please try again"})}})),n.a.serializeUser((e,r)=>r(null,e.id)),n.a.deserializeUser(async(e,r)=>{try{return r(null,await u.findById(e))}catch(e){return r(e)}})},function(e,r,t){"use strict";t.r(r);var s=t(5);const n=process.env.PORT||4e3;s.a,s.b;s.a.listen(n,()=>{console.log(`Server started on port ${n}`)})},function(e,r,t){e.exports=t(24)}]);
//# sourceMappingURL=server.bundle.js.map