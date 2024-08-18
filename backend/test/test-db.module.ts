import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;
export const TestDbModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    return {
      uri: mongoUri,
    };
  },
  inject: [ConfigService],
});

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};

export const clearCollections = async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({});
    }),
  );
};
