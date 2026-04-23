-- CreateTable
CREATE TABLE "scores" (
    "sbd" VARCHAR(10) NOT NULL,
    "toan" DOUBLE PRECISION,
    "ngu_van" DOUBLE PRECISION,
    "ngoai_ngu" DOUBLE PRECISION,
    "vat_li" DOUBLE PRECISION,
    "hoa_hoc" DOUBLE PRECISION,
    "sinh_hoc" DOUBLE PRECISION,
    "lich_su" DOUBLE PRECISION,
    "dia_li" DOUBLE PRECISION,
    "gdcd" DOUBLE PRECISION,
    "ma_ngoai_ngu" VARCHAR(5),

    CONSTRAINT "scores_pkey" PRIMARY KEY ("sbd")
);
