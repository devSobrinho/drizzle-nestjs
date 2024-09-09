create trigger set_name_lowercase after
insert
    or
update
    on
    main.permission for each row execute function main.lowercase_name()