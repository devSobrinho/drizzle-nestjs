CREATE OR REPLACE FUNCTION main.mask_postal_code(cep character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare 
	numbers_postal_code VARCHAR;
begin
	numbers_postal_code := regexp_replace(cep, '[^0-9]', '', 'g');

	return SUBSTRING(numbers_postal_code from 1 for 5) || '-' || SUBSTRING(numbers_postal_code from 6 for 3);
end;
$function$
;
