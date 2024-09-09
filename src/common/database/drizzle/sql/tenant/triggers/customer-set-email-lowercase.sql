CREATE TRIGGER set_email_lowercase
BEFORE insert or update 
ON "customer"
FOR EACH ROW
EXECUTE PROCEDURE main.lowercase_email();