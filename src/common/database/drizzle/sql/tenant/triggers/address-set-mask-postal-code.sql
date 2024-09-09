create trigger set_mask_postal_code after
insert
    or
update
    on
    address for each row execute function main.format_postal_code()