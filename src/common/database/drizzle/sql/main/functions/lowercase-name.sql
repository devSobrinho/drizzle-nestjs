create or replace function main.lowercase_name()
returns trigger as $$
begin 
	IF new.name IS NOT NULL THEN
		new.name := LOWER(new.name);
	END IF;
	return new;
end;
$$ language plpgsql;