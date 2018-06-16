import mongoose from 'mongoose';
import './models';

const connect = async () => mongoose.connect(process.env.DB_URL);

export default connect;

