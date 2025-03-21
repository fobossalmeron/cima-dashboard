// import { authClient } from '@/lib/auth/auth-client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador
  // await authClient.signUp.email({
  //   email: 'admin@cima.com',
  //   password: 'superadmin123',
  //   name: 'Administrador',
  // })

  // await prisma.user.update({
  //   where: { email: 'admin@cima.com' },
  //   data: {
  //     role: Role.SUPER_ADMIN,
  //   },
  // })
  // Crear token de Repsly
  await prisma.serviceToken.upsert({
    where: { service: 'repsly' },
    update: {},
    create: {
      service: 'repsly',
      token: process.env.REPSLY_TOKEN || 'your-token-here',
      refreshToken:
        process.env.REPSLY_REFRESH_TOKEN || 'your-refresh-token-here',
      serviceClientId: process.env.REPSLY_CLIENT_ID || 'your-client-id-here',
      fingerprint: process.env.REPSLY_FINGERPRINT || 'your-fingerprint-here',
      expiresAt: process.env.REPSLY_EXPIRES_AT
        ? new Date(parseInt(process.env.REPSLY_EXPIRES_AT) * 1000)
        : new Date(),
    },
  })

  await prisma.photoType.create({
    data: {
      slug: 'product',
      description: 'FOTO DEL PRODUCTO en el Estante',
    },
  })

  await prisma.photoType.create({
    data: {
      slug: 'promotor',
      description: 'FOTO DE LA PROMOTORA con la Mesa de Activación',
    },
  })

  await prisma.photoType.create({
    data: {
      slug: 'client',
      description: 'FOTO DE CLIENTE',
    },
  })

  await prisma.photoType.create({
    data: {
      slug: 'other',
      description: 'Foto',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
