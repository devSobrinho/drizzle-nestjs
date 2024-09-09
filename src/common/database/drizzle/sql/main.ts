export const contentSqlMainTxt = `
CREATE OR REPLACE FUNCTION main.format_postal_code()
 RETURNS TRIGGER AS $$
 BEGIN
  NEW.postal_code := main.mask_postal_code(NEW.postal_code);
	RETURN NEW;
 END;
$$ LANGUAGE plpgsql;

create or replace function main.lowercase_email()
returns trigger as $$
begin 
	IF new.email IS NOT NULL THEN
		new.email := LOWER(new.email);
	END IF;
	return new;
end;
$$ language plpgsql;

create or replace function main.lowercase_name()
returns trigger as $$
begin 
	IF new.name IS NOT NULL THEN
		new.name := LOWER(new.name);
	END IF;
	return new;
end;
$$ language plpgsql;

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

create trigger set_name_lowercase after
insert
    or
update
    on
    main.permission for each row execute function main.lowercase_name()

create trigger set_name_lowercase after
insert
    or
update
    on
    main.role for each row execute function main.lowercase_name()

create trigger set_email_lowercase after
insert
    or
update
    on
    main.tenant for each row execute function main.lowercase_email()

CREATE TRIGGER set_email_lowercase
BEFORE insert or update 
ON main."user"
FOR EACH ROW
EXECUTE PROCEDURE main.lowercase_email();
`;
