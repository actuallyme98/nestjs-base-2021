import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { UserEntity } from '@db/entities';
import { EncryptUtils } from '@common/utils';
import * as adminData from './data/users.json';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const qb = connection.getRepository(UserEntity).createQueryBuilder();
    if (await qb.getOne()) {
      return;
    }

    const arr = await Promise.all(
      (adminData as UserEntity[]).map(
        async (item) =>
          new UserEntity({
            ...item,
            password: await EncryptUtils.hash(item.password),
          }),
      ),
    );
    await qb.insert().values(arr).execute();
  }
}
