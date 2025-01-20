create policy "Enable delete for users based on user_id"
on "public"."catalogos_tbl_empresas"
as permissive
for delete
to authenticated
using (true);



