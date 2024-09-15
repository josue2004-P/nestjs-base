import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  Res,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetTasksDto } from './dto/get-task.dto';
import { Response } from 'express';

@Controller('task')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(@Query() query?: GetTasksDto): Promise<any> {
    return await this.taskService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const task = await this.taskService.findOne(id);

      // Retornamos 202 si la tarea existe
      return response.status(HttpStatus.ACCEPTED).json({
        status: HttpStatus.ACCEPTED,
        message: 'Task successfully found',
        task,
      });
    } catch (error) {
      // Si es una excepción conocida, la lanzamos de nuevo
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Para cualquier otro error no controlado
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Res() response: Response,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<any> {
    try {
      const task = await this.taskService.update(id,updateTaskDto);

      // Retornamos 202 si la tarea existe
      return response.status(HttpStatus.ACCEPTED).json({
        status: HttpStatus.ACCEPTED,
        message: 'Task successfully found',
        task,
      });
    } catch (error) {
      // Si es una excepción conocida, la lanzamos de nuevo
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Para cualquier otro error no controlado
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const task = await this.taskService.remove(id);

      // Retornamos 202 si la tarea existe
      return response.status(HttpStatus.ACCEPTED).json({
        status: HttpStatus.ACCEPTED,
        message: 'Task successfully found',
        task,
      });
    } catch (error) {
      // Si es una excepción conocida, la lanzamos de nuevo
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Para cualquier otro error no controlado
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
