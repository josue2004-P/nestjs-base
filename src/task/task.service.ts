import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { GetTasksDto } from './dto/get-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(createTaskDto: CreateTaskDto): Promise<any> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
        },
      });

      return task;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw new Error('Ocurrió un error al crear la tarea');
    }
  }

  // GETTASK
  async findAll(getTasksDto?: GetTasksDto): Promise<any> {
    try {
      const {
        page = 0,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = getTasksDto || {};

      const offset = page * limit;

      const tasks = await this.prisma.task.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          [sortBy]: order === 'asc' ? 'asc' : 'desc',
        },
      });

      return {
        total: await this.prisma.task.count(),
        tasks,
      };
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw new Error('Ocurrió un error al obtener las tareas');
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: id },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async update(id: string, updatedTaskDto: UpdateTaskDto): Promise<any> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: id },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const taskUpdate = await this.prisma.task.update({
        where: {
          id: id,
        },
        data: updatedTaskDto,
      });
      return taskUpdate;
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: id },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const taskDelete = await this.prisma.task.delete({ where: { id } });
      return taskDelete;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
