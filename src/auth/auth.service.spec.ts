import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const user = users.filter((user) => user.email === email);

        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          name,
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be Created', async () => {
    const user = await service.register('asdasd', 'asdasd@gmail.com', 'asdasd');

    expect(user.name).toEqual('asdasd');
    expect(user.email).toEqual('asdasd@gmail.com');

    expect(user.password).not.toEqual('asdasd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Should be fail to create a user with an existing email', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          name: 'asdasd',
          email: 'asdasd@gmail.com',
          password: 'asdasd',
        } as User,
      ]);

    await expect(
      service.register('asdasd', 'asdasd@gmail.com', 'asdasd'),
    ).rejects.toThrow('Email already exists');
  });

  it('Should be fail if user login with invalid email', async () => {
    await expect(service.login('asdasd@gmail.com', 'asdasd')).rejects.toThrow(
      'User not found',
    );
  });

  it('Should be fail if user login with invalid password', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          name: 'asdasd',
          email: 'asdasd@gmail.com',
          password: 'asdasd',
        } as User,
      ]);

    await expect(service.login('asdasd@gmail.com', 'asdasda')).rejects.toThrow(
      'Wrong password',
    );
  });

  it('Should login existing user', async () => {
    await service.register('asdasd', 'asdasd@gmail.com', 'asdasd');

    const user = await service.login('asdasd@gmail.com', 'asdasd');

    expect(user).toBeDefined();
  });
});
