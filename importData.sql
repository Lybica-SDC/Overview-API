-- product.csv
-- id,name,slogan,description,category,default_price
-- 1,"Camo Onesie","Blend in to your crowd","The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.","Jackets",140

-- styles.csv
-- id,productId,name,sale_price,original_price,default_style
-- 1,1,"Forest Green & Black",null,140,1

-- photos.csv
-- id,styleId,url,thumbnail_url
-- 1,1,"https://etc","https://etc"

-- features.csv
-- id,product_id,feature,value
-- 1,1,"Fabric","Canvas"

-- related.csv
-- id,current_product_id,related_product_id
-- 1,1,2

-- skus.csv
-- id,styleId,size,quantity
-- 1,1,"XS",8


DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"slogan" TEXT,
	"description" TEXT,
	"category" TEXT,
	"default_price" NUMERIC(12,2) NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "styles" (
	"id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"name" TEXT NOT NULL,
	"sale_price" NUMERIC(12,2),
	"original_price" NUMERIC(12,2) NOT NULL,
	"default?" bool,
	CONSTRAINT "styles_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "photos" (
	"id" serial NOT NULL,
	"style_id" int NOT NULL,
	"url" TEXT NOT NULL,
	"thumbnail_url" TEXT NOT NULL,
	CONSTRAINT "photos_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "features" (
	"id" serial NOT NULL,
	"product_id" int NOT NULL,
	"feature" TEXT,
	"value" TEXT,
	CONSTRAINT "features_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "related" (
	"id" serial NOT NULL,
	"current_product_id" int NOT NULL,
	"related_product_id" int,
	CONSTRAINT "related_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "skus" (
	"id" serial NOT NULL,
	"style_id" int NOT NULL,
	"size" TEXT NOT NULL,
	"quantity" int NOT NULL,
	CONSTRAINT "skus_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "styles" ADD CONSTRAINT "styles_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "photos" ADD CONSTRAINT "photos_fk0" FOREIGN KEY ("style_id") REFERENCES "styles"("id");
ALTER TABLE "features" ADD CONSTRAINT "features_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "related" ADD CONSTRAINT "related_fk0" FOREIGN KEY ("current_product_id") REFERENCES "products"("id");
ALTER TABLE "related" ADD CONSTRAINT "related_fk1" FOREIGN KEY ("related_product_id") REFERENCES "products"("id");
ALTER TABLE "skus" ADD CONSTRAINT "skus_fk0" FOREIGN KEY ("style_id") REFERENCES "styles"("id");


COPY products
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/product.csv' DELIMITER ',' CSV HEADER NULL AS 'null';

COPY styles
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/styles.csv' DELIMITER ',' CSV HEADER NULL AS 'null';

COPY photos
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/photos.csv' DELIMITER ',' CSV HEADER NULL AS 'null';

COPY features
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/features.csv' DELIMITER ',' CSV HEADER NULL AS 'null';

COPY related
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/related.csv' DELIMITER ',' CSV HEADER NULL AS '0';

COPY skus
	FROM '/Users/johnathansimeroth/Documents/HackReactor/4 SDC/sdcRawData/product/skus.csv' DELIMITER ',' CSV HEADER NULL AS 'null';