CREATE OR REPLACE FUNCTION main.format_postal_code()
 RETURNS TRIGGER AS $$
 BEGIN
  NEW.postal_code := main.mask_postal_code(NEW.postal_code);
	RETURN NEW;
 END;
$$ LANGUAGE plpgsql;