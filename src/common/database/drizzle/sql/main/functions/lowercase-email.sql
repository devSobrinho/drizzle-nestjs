create or replace function main.lowercase_email()
returns trigger as $$
begin 
	IF new.email IS NOT NULL THEN
		new.email := LOWER(new.email);
	END IF;
	return new;
end;
$$ language plpgsql;