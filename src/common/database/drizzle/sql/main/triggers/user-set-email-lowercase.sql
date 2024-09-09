CREATE TRIGGER set_email_lowercase
BEFORE insert or update 
ON main."user"
FOR EACH ROW
EXECUTE PROCEDURE main.lowercase_email();