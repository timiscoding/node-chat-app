!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=30)}([function(e,t){e.exports=require("passport")},function(e,t){e.exports=require("mongoose")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("hbs")},function(e,t){e.exports=require("path")},function(e,t,r){"use strict";(function(e){r.d(t,"a",function(){return O}),r.d(t,"b",function(){return U});var o=r(2),n=r.n(o),a=r(27),s=r.n(a),i=r(26),c=r.n(i),l=r(3),u=r.n(l),d=r(25),m=r.n(d),p=r(4),g=r.n(p),f=r(10),h=r.n(f),w=r(11),b=(r(28),r(12)),v=r(17),y=r(13);const k=n()(),O=s.a.createServer(k),U=c()(O);Object(w.a)().catch(e=>console.error("Could not connect to DB",e.message)),u.a.localsAsTemplateData(k),u.a.registerHelper("toJSON",e=>JSON.stringify(e,null,2)),u.a.registerHelper("linkedAccounts",e=>{let t="";const r=e.toObject(),o=e.accountsTotal()>1;return Object.entries(r).forEach(([e,r])=>{("local"===e&&r.email||r.token)&&(t+=`<tr><td>${e}</td>\n              <td>${"local"===e?r.email:r.username||r.displayName}</td>`,o&&(t+=`<td><form method="post" action="/unlink/${e}"><button>Unlink</button></form></td></tr>`))}),new h.a.SafeString(t)}),u.a.registerHelper("linkableAccounts",e=>{const t=e.toObject(),r=["local","twitter","google","facebook"].filter(e=>!t[e]||"local"!==e&&!t[e].token);return new h.a.SafeString(r.map(e=>`<a class="linkButton" href="/link/${e}">${e}</a>`).join(""))});const S=m()(u.a);S.registerPartials.bind(S)(g.a.join(e,"../views/partials"),{}),k.set("view engine","hbs"),k.use(v.a),U.on("connection",e=>{console.log("New user connected"),Object(b.a)(e,U)}),k.use((e,t,r)=>{const o=e.flash();t.locals.user=e.user,t.locals.flashes=Object.keys(o).length>0?o:void 0,r()}),k.use("/",y.a)}).call(this,"/Users/tim/Work/misc/complete-node/node-chat-app/server")},function(e,t){e.exports=require("express-validator/check")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("moment")},function(e,t){e.exports=require("bcrypt")},function(e,t){e.exports=require("handlebars")},function(e,t,r){"use strict";var o=r(1),n=r.n(o),a=r(9),s=r.n(a),i=r(24),c=r.n(i),l=r(23),u=r.n(l);const d=new n.a.Schema({local:{email:{type:String,unique:"An account with email {VALUE} already exists",sparse:!0,trim:!0,lowercase:!0,validate:[c.a,"Email is not valid"]},password:{type:String,trim:!0,minlength:5},username:{type:String,unique:"Username already taken",sparse:!0,lowercase:!0,trim:!0,match:[/^[\w-]+$/,"Username must contain alphanumeric, '-', '_' characters only"]}},facebook:{id:String,token:String,displayName:String,email:String},twitter:{id:String,token:String,displayName:String,username:String},google:{id:String,token:String,displayName:String,email:String}});d.methods.isValidPassword=function(e){return s.a.compare(e,this.local.password)};const m=["twitter","google","facebook","local"];d.methods.accountsTotal=function(){return Object.keys(this.toObject()).reduce((e,t)=>m.includes(t)&&("local"===t||"local"!==t&&this[t].token)?e+1:e,0)},d.statics.hashPassword=function(e){if(!e)throw new Error("Password cannot be blank");return s.a.hash(e,12)},d.plugin(u.a);n.a.model("User",d);t.a=(async()=>n.a.connect(process.env.DB_URL))},function(e,t,r){"use strict";var o=e=>"string"==typeof e&&e.trim().length>0,n=r(8),a=r.n(n);const s=(e,t)=>({from:e,text:t,createdAt:a()().valueOf()});const i=(()=>{let e;const t=()=>new class{constructor(){this.users=[]}addUser(e,t,r){const o={id:e,name:t,room:r};return this.users.push(o),o}removeUser(e){const t=Object.assign({},this.getUser({id:e}));return t&&(this.users=this.users.filter(e=>e.id!==t.id)),t}getUser({id:e,name:t}){return this.users.find(r=>r.id===e||r.name===t)}getUserList(e){return this.users.filter(t=>t.room===e).map(e=>e.name)}getRoomList(){return[...new Set(this.users.map(e=>e.room))]}};return{getInstance:()=>(e||(e=t()),e)}})().getInstance(),c=e=>{e.emit("updateRoomList",{rooms:i.getRoomList()})},l=(e,t)=>e.on("createLocationMessage",r=>{const o=i.getUser({id:e.id});o&&t.to(o.room).emit("newLocationMessage",((e,t,r)=>({from:e,url:`https://www.google.com/maps?q=${t},${r}`,createdAt:a()().valueOf()}))(o.name,r.latitude,r.longitude))});t.a=((e,t)=>({joinRoom:((e,t)=>e.on("join",(r,n)=>{if(!o(r.name)||!o(r.room))return n("Name and Room name are required!");const a=r.name.trim(),l=r.room.trim().toLowerCase(),u=i.getUser({name:a});return u&&u.room===l?n("Username taken!"):(e.join(l),i.removeUser(e.id),i.addUser(e.id,a,l),t.to(l).emit("updateUserList",i.getUserList(l)),e.emit("newMessage",s("Admin",`Welcome to the room ${l}!`)),e.broadcast.to(l).emit("newMessage",s("Admin",`${a} joined the chat`)),c(t),n())}))(e,t),createMessage:((e,t)=>e.on("createMessage",(r,n)=>{const a=i.getUser({id:e.id});a&&o(r.text)&&t.to(a.room).emit("newMessage",s(a.name,r.text)),n()}))(e,t),createLocationMessage:l(e,t),disconnect:((e,t)=>e.on("disconnect",()=>{const r=i.removeUser(e.id);t.to(r.room).emit("updateUserList",i.getUserList(r.room)),t.to(r.room).emit("newMessage",s("Admin",`${r.name} has left`)),c(t)}))(e,t),getRoomList:(e=>e.on("getRoomList",(e,t)=>{t({rooms:i.getRoomList()})}))(e)}))},function(e,t,r){"use strict";var o=r(2),n=r.n(o),a=r(14),s=r(1),i=r.n(s),c=r(6);const l=e=>(t,r,o)=>e(t,r,o).catch(o),u=i.a.model("User"),d=[Object(c.checkSchema)({username:{in:"body",isLength:{errorMessage:"Username must not be empty",options:{min:1}},matches:{errorMessage:"Username must be letters, numbers, '_', '-' only",options:/^[\w-]+$/},trim:!0},email:{in:"body",isEmail:{errorMessage:"Email address is not valid"},trim:!0,normalizeEmail:{options:{all_lowercase:!0,gmail_convert_googlemaildotcom:!0,gmail_remove_dots:!0,gmail_remove_subaddress:!0}}},password:{in:"body",isLength:{errorMessage:"Password must be at least 5 characters long",options:{min:5}},trim:!0},"password-confirm":{in:"body",custom:{options:(e,{req:t})=>{if(t.body.password!==e)throw new Error("Password confirmation does not match password field");return!0}}}}),(e,t,r)=>{const o=Object(c.validationResult)(e).formatWith(({msg:e})=>e);o.isEmpty()?r():(e.flash("error",o.array({onlyFirstError:!0})),t.render("signup",{body:e.body,flashes:e.flash()}))}];var m={createOne:async(e,t,r)=>{const{email:o,password:n,username:a}=e.body;try{const s=new u({local:{email:o,password:await u.hashPassword(n),username:a}});await s.save(),e.login(s,r),e.flash("success","New account created!"),t.redirect("/")}catch(n){if(n.errors){const r=Object.keys(n.errors).map(e=>n.errors[e].message);e.flash("error",r),t.render("signup",{body:{username:a,email:o},flashes:e.flash()})}else r(n)}},getOne:l(async(e,t)=>{const r=await u.findById(e.user.id);t.send(`get user\n ${r}`)}),updateOne:l((e,t)=>{t.send(`update user\n ${e.docFromId}`)}),deleteOne:l((e,t)=>{t.send(`delete user\n ${e.docFromId}`)}),signupForm:(e,t)=>{t.render("signup")},validateNewUser:d};const p=n.a.Router(),g=i.a.model("User");p.param("id",async(e,t,r,o)=>{try{if(!i.a.Types.ObjectId.isValid(o))throw new Error("Invalid user id");const t=await g.findById(o);if(!t)throw new Error("No user found");e.docFromId=t,r()}catch(e){r(e.message)}}),p.route("/signup").get(m.signupForm).post(m.validateNewUser,m.createOne),p.route("/user/:id").get(Object(a.ensureLoggedIn)(),m.getOne).put(m.updateOne).delete(m.deleteOne);var f=r(0),h=r.n(f);const w=i.a.model("User");var b={loginForm:(e,t)=>t.render("login"),loginUser:h.a.authenticate("local",{successReturnToOrRedirect:"/",failureRedirect:"/login",failureFlash:"Email or password is invalid",successFlash:"You have logged in"}),logoutUser:(e,t)=>{e.logout(),e.flash("info","You have logged out"),t.redirect("/")},genOauthLogin:(e,t={})=>({auth:(r,o,n)=>(r.user?h.a.authorize:h.a.authenticate).call(h.a,e,t.scope&&{scope:t.scope})(r,o,n),authCb(t,r,o){const n=t.user?h.a.authorize:h.a.authenticate,a=t.user?{failureRedirect:"/profile",failureFlash:`${e} account was not linked`}:(n,a,s)=>n?o(n):a?t.login(a,n=>n?o(n):(t.flash("success",`You have logged in, ${a[e].displayName||a[e].username}`),s.firstLogin?r.redirect("/profile"):r.redirect("/"))):(t.flash("error",`Permission to login via ${e} was denied`),r.redirect("/login"));return n.call(h.a,e,a)(t,r,o)}}),profile:async(e,t)=>{t.render("profile")},authLocal:h.a.authorize("local",{failureRedirect:"/link/local",failureFlash:"Email or password is invalid"}),linkAccount:async(e,t,r)=>{const{user:o,account:n}=e;if(o&&n){const r=n.toObject({transform(e,t){const r=Object.assign({},t);return delete r.__v,delete r._id,r}});return r.local&&await w.deleteOne({"local.email":r.local.email}),Object.assign(o,r),await o.save(),await n.remove(),e.flash("success","Accounts have been linked"),t.redirect("/profile")}return r()},unlinkAccount:async(e,t,r)=>{const o=e.params.account,{user:n}=e;if(!["twitter","google","facebook","local"].includes(o)){const e=new Error("Unknown account type");return e.status=400,r(e)}if(1===n.accountsTotal)return e.flash("error","Unable to unlink solo account"),t.redirect("/profile");if("local"===o){const e=Object.assign({},n.local);n.local=void 0,await n.save(),await w.create({local:e})}else n[o].token=void 0,await n.save();e.flash("success","Account has been unlinked"),t.redirect("/profile")},linkLocalForm:(e,t)=>t.render("link_local")};const v=(e,t,r)=>{e.isAuthenticated()?r():t.redirect("/")},y=n.a.Router();y.get("/login",b.loginForm),y.post("/login",b.loginUser),y.get("/logout",v,b.logoutUser),y.get("/profile",v,l(b.profile)),y.get("/link/local",b.linkLocalForm),y.post("/link/local",b.authLocal,l(b.linkAccount)),y.post("/unlink/:account",l(b.unlinkAccount)),[{provider:"facebook",config:{scope:"email"}},{provider:"twitter"},{provider:"google",config:{scope:"https://www.googleapis.com/auth/userinfo.profile"}}].forEach(({provider:e,config:t})=>{const{auth:r,authCb:o}=b.genOauthLogin(e,t);y.get(`/auth/${e}`,r),y.get(`/auth/${e}/callback`,o,l(b.linkAccount)),y.get(`/link/${e}`,r)});const k=n.a.Router();k.use("/",y),k.use("/",p),k.get("/",(e,t)=>{t.render("index",{title:"Join"})}),k.post("/chat",(e,t)=>{t.render("chat",{title:"Chat"})}),k.use((e,t,r,o)=>{if(!e.errors)return o(e);const n=Object.keys(e.errors);return n.length>0&&n.forEach(r=>t.flash("error",e.errors[r].message)),r.redirect("back")}),k.use((e,t,r,o)=>{const n=e.status||500;r.status(n).render("error",{status:n,message:e.message})});t.a=k},function(e,t){e.exports=require("connect-ensure-login")},function(e,t){e.exports=require("connect-flash")},function(e,t){e.exports=require("express-session")},function(e,t,r){"use strict";(function(e){var o=r(2),n=r.n(o),a=r(4),s=r.n(a),i=r(7),c=r.n(i),l=r(0),u=r.n(l),d=r(16),m=r.n(d),p=r(15),g=r.n(p);t.a=[n.a.static(s.a.join(e,"../public")),c.a.json(),c.a.urlencoded({extended:!0}),m()({secret:process.env.SESSION_SECRET,resave:!1,saveUninitialized:!1}),u.a.initialize(),u.a.session(),g()()]}).call(this,"/Users/tim/Work/misc/complete-node/node-chat-app/server")},function(e,t){e.exports=require("lodash")},function(e,t){e.exports=require("passport-google-oauth")},function(e,t){e.exports=require("passport-twitter")},function(e,t){e.exports=require("passport-facebook")},function(e,t){e.exports=require("passport-local")},function(e,t){e.exports=require("mongoose-beautiful-unique-validation")},function(e,t){e.exports=require("validator/lib/isEmail")},function(e,t){e.exports=require("hbs-utils")},function(e,t){e.exports=require("socket.io")},function(e,t){e.exports=require("http")},function(e,t,r){"use strict";var o=r(0),n=r.n(o),a=r(22),s=r.n(a),i=r(21),c=r.n(i),l=r(20),u=r.n(l),d=r(19),m=r(1),p=r.n(m),g=r(18),f=r.n(g);const h=p.a.model("User");n.a.use(new s.a({usernameField:"email",passReqToCallback:!0},async(e,t,r,o)=>{try{const e=await h.findOne({"local.email":t});return o(null,e?!!await e.isValidPassword(r)&&e:!1)}catch(e){return o(e,null,{message:"Could not authenticate. Please try again"})}}));const w=async e=>{if(!e)return;const t=e.toLowerCase().replace(/ /g,"_"),r=new RegExp(`^${t}d*$`),o=await h.find({username:r},"username");let n=t;for(let e=0;f.a.find(o,{username:n});e+=1)n=t+(o.length+e);return n},b=e=>e.emails&&e.emails.length&&e.emails[0].value,v=e=>async(t,r,o,n,a)=>{try{let o=await h.findOne({[`${e}.id`]:n.id});return t.user?o?(o[e].token||(o=await h.create({[e]:{id:n.id,username:await w(n.username),displayName:n.displayName,token:r,email:b(n)}})),a(null,o)):a(null,o=await h.create({[e]:{id:n.id,username:await w(n.username),displayName:n.displayName,token:r,email:b(n)}})):o?a(null,o):a(null,o=await h.create({[e]:{id:n.id,username:await w(n.username),displayName:n.displayName,token:r,email:b(n)}}),{firstLogin:!0})}catch(e){return a(e,!1,{message:"Could not authenticate. Please try again"})}};n.a.use(new c.a({clientID:process.env.FACEBOOK_APP_ID,clientSecret:process.env.FACEBOOK_APP_SECRET,callbackURL:`${process.env.DOMAIN}/auth/facebook/callback`,profileFields:["email","displayName"],passReqToCallback:!0},v("facebook"))),n.a.use(new u.a({consumerKey:process.env.TWITTER_CONSUMER_KEY,consumerSecret:process.env.TWITTER_CONSUMER_SECRET,callbackURL:`${process.env.DOMAIN}/auth/twitter/callback`,passReqToCallback:!0},v("twitter"))),n.a.use(new d.OAuth2Strategy({clientID:process.env.GOOGLE_APP_ID,clientSecret:process.env.GOOGLE_APP_SECRET,callbackURL:`${process.env.DOMAIN}/auth/google/callback`,passReqToCallback:!0},v("google"))),n.a.serializeUser((e,t)=>t(null,e.id)),n.a.deserializeUser(async(e,t)=>{try{return t(null,await h.findById(e))}catch(e){return t(e)}})},function(e,t,r){"use strict";r.r(t);var o=r(5);const n=process.env.PORT||4e3;o.a,o.b;o.a.listen(n,()=>{console.log(`Server started on port ${n}`)})},function(e,t,r){e.exports=r(29)}]);
//# sourceMappingURL=server.bundle.js.map