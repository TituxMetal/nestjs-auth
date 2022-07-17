import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '~/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') || 3333
  const hostUrl = configService.get<string>('HOST') || 'localhost'
  await app.listen(port, hostUrl, () => console.log(`Listen on http://${hostUrl}:${port}`))
}
bootstrap()
