import { Injectable, Response, StreamableFile } from '@nestjs/common';
import { Image } from './Image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, fsync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getImage(res): Promise<StreamableFile> {
    const result = await this.imageRepository.find();
    const lastResult = result[result.length - 1];

    const imageFile = createReadStream(
      join(process.cwd(), 'uploads', lastResult.name),
    );
    console.log(process.cwd());

    res.set('Content-Type', lastResult.mimetype);

    return new StreamableFile(imageFile);
  }

  create(image: Express.Multer.File) {
    console.log(image);

    return this.imageRepository.save({
      name: image.filename,
      mimetype: image.mimetype,
      size: image.size,
      description: image.originalname,
    });
  }

  remove(id: number) {
    unlinkSync(
      join(process.cwd(), 'uploads', '0b39219a4b3b480739788c3d61717bec'),
    );
    return {};
    //this.imageRepository.delete(id);
  }
}
