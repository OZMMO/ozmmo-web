create policy "Enable delete for users based on user_id"
on "catalogos"."tbl_empresas"
as permissive
for delete
to authenticated
using (true);



