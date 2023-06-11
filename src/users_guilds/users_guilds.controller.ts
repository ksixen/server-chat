import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { UserGuildsService } from './users_guilds.service';
import type { Request, Response } from 'express';
import { MONGOOSE_ERRORS } from '@/utils/errorCodes';

import { useMe } from 'src/funcs/useMe';

@Controller('users_guilds')
export default class UsersGuildsController {
  constructor(
    @Inject(UserGuildsService) private userGuilds: UserGuildsService,
  ) {}
  expiresAge = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  @Get()
  async create(@Req() request: Request, @Res() response: Response) {
    const user = useMe(request);

    this.userGuilds
      .findMyGuilds(user.user_id)
      .then((guilds) => {
        response.status(200).send({
          response: guilds,
        });
      })
      .catch(
        (err: {
          message: any;
          code: keyof typeof MONGOOSE_ERRORS;
          keyValue: Record<string, string>;
        }) => {
          const errCode = err.code;
          if (errCode in MONGOOSE_ERRORS && MONGOOSE_ERRORS[errCode]) {
            response.status(401).send({
              response: MONGOOSE_ERRORS[errCode](err?.keyValue),
            });
          } else {
            response.status(401).send({
              response: err?.message,
            });
          }
        },
      );
  }
}