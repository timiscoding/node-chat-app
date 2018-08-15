import mongoose from 'mongoose';
import './models';

const connect = async () => mongoose.connect(process.env.MONGODB_URI);

export default connect;

