import { Prisma } from '@prisma/client'

export type DashboardWithClientAndTemplate = Prisma.DashboardGetPayload<{
  include: {
    client: {
      include: {
        user: {
          select: {
            name: true
            email: true
          }
        }
      }
    }
    template: true
    SyncJob: true
  }
}>

export type DashboardWithLogs = Prisma.DashboardGetPayload<{
  include: {
    syncLogs: true
    client: true
  }
}>

export type DashboardWithRelations = Prisma.DashboardGetPayload<{
  include: {
    template: {
      include: {
        questionGroups: true
        questions: {
          include: {
            options: {
              include: {
                triggers: true
              }
            }
            attachments: true
            triggers: true
          }
        }
        subBrandTemplates: {
          include: {
            subBrand: {
              include: {
                brand: true
              }
            }
          }
        }
      }
    }
    submissions: {
      include: {
        answers: true
        location: true
        representative: true
        activatedBrands: {
          include: {
            brand: true
          }
        }
        productSales: {
          include: {
            product: {
              include: {
                presentation: true
                brand: true
                subBrand: true
                flavor: true
              }
            }
          }
        }
        productLocationSubmissions: {
          include: {
            productLocation: true
          }
        }
        pointOfSale: true
        sampling: {
          include: {
            consumptionMoments: {
              include: {
                consumptionMoment: true
              }
            }
            purchaseIntentions: {
              include: {
                purchaseIntention: true
              }
            }
            traffic: true
            gender: true
            ageRange: true
            ethnicity: true
          }
        }
        photos: {
          include: {
            type: true
          }
        }
        giveawayProducts: {
          include: {
            giveawayProductType: true
          }
        }
        coolerSize: true
        popType: true
      }
    }
    syncLogs: true
  }
}>
