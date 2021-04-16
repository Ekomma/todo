import mongoose from 'mongoose';

const connectdb = async () => {
  try {
    const dbconect = await mongoose.connect(process.env.DB_CONNECT!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${dbconect.connection.host}`);
  } catch (error) {
    console.error(error);
    throw Error;
  }
};

export default connectdb;
