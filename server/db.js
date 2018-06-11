import mongoose from 'mongoose';

const connect = () => mongoose.connect(process.env.DB_URL);

export default connect;

