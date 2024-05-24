import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/:id')
  @Roles(Role.Admin)
  findOneById(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOneById(id);
  }
}