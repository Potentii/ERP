
-- Creating user_view
create view `user_view` as
	select 	`u`.`id`, 
			`u`.`name`, 
            `u`.`login`, 
            `u`.`email`,
			`u`.`cpf`, 
            `u`.`phone`, 
            `u`.`admin`, 
            `u`.`active`,
            `u`.`date`
from user u;


-- Creating user_permission_view
create view `user_permission_view` as
	select 	`user`.`id` as 'user_id', 
			`user`.`login` as 'user_login', 
            `permission`.`title` as 'permission_title'
	from `user` 
    inner join `user_permission` 
		on `user_permission`.`id_user_fk` = `user`.`id` 
    inner join `permission` 
		on `user_permission`.`id_permission_fk` = `permission`.`id`;
