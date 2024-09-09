create trigger set_email_lowercase after
insert
    or
update
    on
    main.tenant for each row execute function main.lowercase_email()