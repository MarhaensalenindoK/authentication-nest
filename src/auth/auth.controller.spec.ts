import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      // Implementasi fake methods jika diperlukan
    };
    fakeAuthService = {
      login(email, password) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      register(name, email, password) {
        return Promise.resolve({ id: 1, name, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return a user login', async () => {
    const session = {
      userId: 10,
    };
    const user = await controller.loginUser(
      {
        email: 'asd@gmail.com',
        password: 'asd',
      },
      session,
    );

    expect(user).toEqual({
      id: 1,
      email: 'asd@gmail.com',
      password: 'asd',
    });
  });

  it('Should return a user register', async () => {
    const session = {
      userId: 10,
    };

    const user = await controller.registerUser(
      {
        name: 'asd',
        email: 'asd@gmail.com',
        password: 'asd',
      },
      session,
    );

    console.log(session);

    expect(user).toEqual({
      id: 1,
      name: 'asd',
      email: 'asd@gmail.com',
      password: 'asd',
    });

    expect(session.userId).toEqual(1);
  });
});
