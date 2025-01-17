import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { UserDto } from './dtos/user.dto'
import { CreateUpdateUserDto } from './dtos/create-update-user.dto'
import { AuthGuard } from '../../shared/validation'

@ApiTags('user')
@Controller('/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid user input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createUser(@Body() createUserDto: CreateUpdateUserDto): Promise<UserDto> {
    return await this.userService.createUser(createUserDto)
  }

  @Put('/add-money')
  @ApiOperation({ summary: 'Add money to total amount' })
  @ApiResponse({ status: 201, description: 'Money added succesfully.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addMoney(@Body('accountId') accountId: string, @Body('amount') amount: number): Promise<UserDto> {
    return this.userService.addMoneyToUser(accountId, amount)
  }

  @Put('/remove-money')
  @ApiOperation({ summary: 'Remove money from total amount' })
  @ApiResponse({ status: 201, description: 'Money removed succesfully.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async removeMoney(@Body('accountId') accountId: string, @Body('amount') amount: number): Promise<UserDto> {
    return this.userService.removeMoneyFromUser(accountId, amount)
  }

  @Get('/account/:id')
  @ApiOperation({ summary: 'Retrieve a single user by Account ID' })
  @ApiResponse({ status: 200, description: 'User details.', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUserByAccountId(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.getSingleUserByAccountId(id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiResponse({ status: 200, description: 'User details.', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return await this.userService.getSingleUser(id)
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users.', type: [UserDto] })
  @ApiResponse({ status: 404, description: 'Users not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllUsers(): Promise<UserDto[]> {
    return await this.userService.getAllUsers()
  }

  @Put('/account/:id')
  @ApiOperation({ summary: 'Update a user by Account ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid user input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateUserByAccountId(@Param('id') id: string, @Body() updateUserDto: CreateUpdateUserDto): Promise<UserDto> {
    return await this.userService.updateUserByAccountId(id, updateUserDto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid user input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUpdateUserDto): Promise<UserDto> {
    return await this.userService.updateUser(id, updateUserDto)
  }

  @Delete('/account/:id')
  @ApiOperation({ summary: 'Delete a user by Account ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.', type: Boolean })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUserByAccountId(@Param('id') id: string): Promise<boolean> {
    return await this.userService.deleteUserByAccountId(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.', type: Boolean })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    return await this.userService.deleteUser(id)
  }
}
