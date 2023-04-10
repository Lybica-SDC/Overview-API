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

-- DROP INDEX IF EXISTS idx_styles_product_id;
-- DROP INDEX IF EXISTS idx_photos_style_id;
-- DROP INDEX IF EXISTS idx_features_product_id;
-- DROP INDEX IF EXISTS idx_related_current_product_id;
-- DROP INDEX IF EXISTS idx_related_product_id;
-- DROP INDEX IF EXISTS idx_skus_style_id;

CREATE INDEX idx_styles_product_id ON styles USING hash (product_id);
CREATE INDEX idx_photos_style_id ON photos USING hash (style_id);
CREATE INDEX idx_features_product_id ON features USING hash (product_id);
CREATE INDEX idx_related_current_product_id ON related USING hash (current_product_id);
CREATE INDEX idx_related_product_id ON related USING hash (related_product_id);
CREATE INDEX idx_skus_style_id ON skus USING hash (style_id);