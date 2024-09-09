export const contentSqlTenantTxt = `create trigger set_mask_postal_code after
insert
    or
update
    on
    address for each row execute function main.format_postal_code()

CREATE TRIGGER set_email_lowercase
BEFORE insert or update 
ON "customer"
FOR EACH ROW
EXECUTE PROCEDURE main.lowercase_email();
`;
