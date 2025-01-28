-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
