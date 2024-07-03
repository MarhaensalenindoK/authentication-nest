import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['R4nDomStr1!!!ng'],
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
