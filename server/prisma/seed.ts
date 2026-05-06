import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PASSWORD = 'Password123!';
const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12);

const PRODUCTS: Array<{
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  tone: string;
  label: string;
  material: string;
  madeBy: string;
  tag?: string;
}> = [
  // ========= BOUQUETS =========
  {
    name: 'Sunflower Bouquet',
    description:
      'A single hand-crocheted sunflower wrapped in soft kraft paper — a forever-bloom that never wilts.',
    price: 980,
    stock: 30,
    imageUrl: '',
    category: 'Bouquets',
    tone: 'beige',
    label: 'sunflower bouquet',
    material: 'Organic cotton',
    madeBy: 'Maria',
    tag: 'Best seller',
  },
  {
    name: 'Daisy Field Bouquet',
    description:
      'A small handful of crocheted daisies, each petal stitched and shaped one at a time. Wrapped in linen.',
    price: 1280,
    stock: 25,
    imageUrl: '',
    category: 'Bouquets',
    tone: 'cream',
    label: 'daisy field',
    material: 'Organic cotton',
    madeBy: 'Joana',
  },
  {
    name: 'Rose Cone Bouquet',
    description:
      'Three hand-crocheted roses on green stems, tied in a paper cone. Choose blush or red — both age beautifully.',
    price: 1480,
    stock: 22,
    imageUrl: '',
    category: 'Bouquets',
    tone: 'blush',
    label: 'rose cone',
    material: 'Organic cotton',
    madeBy: 'Maria',
  },
  {
    name: 'Tulip Trio',
    description:
      'Three crocheted tulips with leaves — one of our most quietly loved pieces. Multiple colorways.',
    price: 1180,
    stock: 28,
    imageUrl: '',
    category: 'Bouquets',
    tone: 'blush',
    label: 'tulip trio',
    material: 'Organic cotton',
    madeBy: 'Both makers',
    tag: 'New',
  },
  {
    name: 'White Lily Bouquet',
    description:
      'A bouquet of seven hand-crocheted lilies, wrapped in soft cream paper. A patient gift, made to last.',
    price: 1980,
    stock: 14,
    imageUrl: '',
    category: 'Bouquets',
    tone: 'cream',
    label: 'lily bouquet',
    material: 'Organic cotton',
    madeBy: 'Joana',
  },

  // ========= GIFT SETS =========
  {
    name: 'Sunflower Gift Box',
    description:
      'Three crocheted sunflower charms in a hand-folded gift box, with a small printed note. Ready to send.',
    price: 1480,
    stock: 24,
    imageUrl: '',
    category: 'Gift Sets',
    tone: 'beige',
    label: 'sunflower gift box',
    material: 'Organic cotton',
    madeBy: 'Maria',
  },
  {
    name: 'Tulip Charm Set',
    description:
      'A small set of crocheted tulip charms in pink and lavender — clip them to a bag, a key ring, or a card.',
    price: 980,
    stock: 30,
    imageUrl: '',
    category: 'Gift Sets',
    tone: 'blush',
    label: 'tulip charms',
    material: 'Organic cotton',
    madeBy: 'Joana',
  },
  {
    name: 'Heart Keychain',
    description:
      'A soft cream heart keychain, hand-crocheted in cotton with a gentle popcorn stitch. A small daily companion.',
    price: 480,
    stock: 50,
    imageUrl: '',
    category: 'Gift Sets',
    tone: 'cream',
    label: 'heart keychain',
    material: 'Organic cotton',
    madeBy: 'Both makers',
  },

  // ========= AMIGURUMI =========
  {
    name: 'Lila — the studio doll',
    description:
      'A small amigurumi doll in a blue dress with brown hair, hand-stitched eyes, and a tiny crocheted heart inside.',
    price: 2480,
    stock: 8,
    imageUrl: '',
    category: 'Amigurumi',
    tone: 'blush',
    label: 'lila doll',
    material: 'Organic cotton',
    madeBy: 'Maria',
    tag: 'Limited',
  },
  {
    name: 'Sol — the sunny doll',
    description:
      'An amigurumi doll with golden hair under a blue hat. Roughly 18cm tall, with carefully embroidered features.',
    price: 2480,
    stock: 6,
    imageUrl: '',
    category: 'Amigurumi',
    tone: 'cream',
    label: 'sol doll',
    material: 'Organic cotton',
    madeBy: 'Joana',
  },

  // ========= TOPS =========
  {
    name: 'Daisy Crop Set',
    description:
      'A two-piece crochet set in mauve cotton with hand-stitched daisy details. Top + matching shorts.',
    price: 4680,
    stock: 12,
    imageUrl: '',
    category: 'Tops',
    tone: 'blush',
    label: 'daisy crop set',
    material: 'Organic cotton',
    madeBy: 'Maria',
    tag: 'Best seller',
  },
  {
    name: 'Linen Halter Bralette',
    description:
      'A delicate halter bralette in unbleached linen with a scalloped hem. Adjustable ties at the back.',
    price: 2880,
    stock: 14,
    imageUrl: '',
    category: 'Tops',
    tone: 'cream',
    label: 'linen halter',
    material: 'Linen',
    madeBy: 'Joana',
  },
  {
    name: 'Petal Bralette',
    description:
      'A short cropped bralette with petal-edge details, in warm terracotta cotton. Cool for summer evenings.',
    price: 2480,
    stock: 16,
    imageUrl: '',
    category: 'Tops',
    tone: 'cocoa',
    label: 'petal bralette',
    material: 'Organic cotton',
    madeBy: 'Both makers',
  },

  // ========= BAGS =========
  {
    name: 'Marigold Tote',
    description:
      'A roomy hand-crocheted tote in warm sand cotton. Soft handles, structured base, made to soften with use.',
    price: 4680,
    stock: 20,
    imageUrl: '',
    category: 'Bags',
    tone: 'beige',
    label: 'marigold tote',
    material: 'Organic cotton',
    madeBy: 'Maria',
  },
  {
    name: 'Petite Crossbody',
    description:
      'A small crossbody bag in deep cocoa cotton, with an adjustable strap and a brass-tone closure.',
    price: 3840,
    stock: 18,
    imageUrl: '',
    category: 'Bags',
    tone: 'cocoa',
    label: 'crossbody — cocoa',
    material: 'Organic cotton',
    madeBy: 'Joana',
  },
  {
    name: 'Beach Market Bag',
    description:
      'An open-weave raffia market bag with leather-wrapped handles. Perfect for slow Saturdays.',
    price: 3120,
    stock: 18,
    imageUrl: '',
    category: 'Bags',
    tone: 'beige',
    label: 'raffia market bag',
    material: 'Raffia',
    madeBy: 'Joana',
  },

  // ========= HATS =========
  {
    name: 'Lila Bucket Hat',
    description:
      'A summer bucket hat in soft cream cotton, hand-stitched with a gentle brim that holds its shape.',
    price: 2520,
    stock: 24,
    imageUrl: '',
    category: 'Hats',
    tone: 'cream',
    label: 'bucket hat',
    material: 'Organic cotton',
    madeBy: 'Maria',
  },

  // ========= HOME =========
  {
    name: 'Olive Throw Cushion',
    description:
      'A 40×40 throw cushion in blush cotton, with a chunky popcorn stitch and concealed zip closure.',
    price: 5760,
    stock: 14,
    imageUrl: '',
    category: 'Home',
    tone: 'blush',
    label: 'throw cushion 40×40',
    material: 'Organic cotton',
    madeBy: 'Maria',
  },
  {
    name: 'Linen Table Runner',
    description:
      'A 180cm linen table runner with a hand-crocheted lace edge in soft sage. Wash gently, dry flat.',
    price: 3480,
    stock: 16,
    imageUrl: '',
    category: 'Home',
    tone: 'sage',
    label: 'table runner 180cm',
    material: 'Linen',
    madeBy: 'Both makers',
  },
  {
    name: 'Soft Wave Throw',
    description:
      'A 130×170 throw blanket in plant-dyed sage merino. Made over several quiet days.',
    price: 10080,
    stock: 6,
    imageUrl: '',
    category: 'Home',
    tone: 'sage',
    label: 'throw blanket 130×170',
    material: 'Merino wool',
    madeBy: 'Both makers',
    tag: 'Limited',
  },
];

async function main() {
  const password = await bcrypt.hash(PASSWORD, ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@jaroche.dev' },
    update: {},
    create: {
      name: 'Jaroche Admin',
      email: 'admin@jaroche.dev',
      password,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@jaroche.dev' },
    update: {},
    create: {
      name: 'Sample Customer',
      email: 'user@jaroche.dev',
      password,
      role: 'CUSTOMER',
      cart: { create: {} },
    },
  });

  // Wipe non-design products so the catalog mirrors the design exactly.
  // Clear referencing rows first to avoid FK violations against legacy products.
  const designNames = PRODUCTS.map((p) => p.name);
  const obsolete = await prisma.product.findMany({
    where: { name: { notIn: designNames } },
    select: { id: true },
  });
  if (obsolete.length > 0) {
    const ids = obsolete.map((p) => p.id);
    await prisma.cartItem.deleteMany({ where: { productId: { in: ids } } });
    await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } });
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
  }

  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: p.description,
          price: new Prisma.Decimal(p.price),
          stock: p.stock,
          imageUrl: p.imageUrl,
          category: p.category,
          tone: p.tone,
          label: p.label,
          material: p.material,
          madeBy: p.madeBy,
          tag: p.tag ?? null,
        },
      });
      continue;
    }
    await prisma.product.create({
      data: { ...p, price: new Prisma.Decimal(p.price), tag: p.tag ?? null },
    });
  }

  console.log(`[seed] users + ${PRODUCTS.length} design products ready.`);
  console.log(`[seed] admin@jaroche.dev / ${PASSWORD}`);
  console.log(`[seed] user@jaroche.dev / ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
