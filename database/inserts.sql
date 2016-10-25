-- *Using the 'eiger_schema':
use `eiger_schema`;


-- *Registering some users:
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `driver_license`, `driver_license_exp`, `department`, `photo`, `active`, `permission_schedules`, `permission_users`, `permission_vehicles`)
	values ('Administrator', 'admin', '1', 'admin@eiger.com', 45920929103, '2080057', 11487596325, '2018-06-15', 'IT', '01.jpg', true, true, true, true);
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `driver_license`, `driver_license_exp`, `department`, `photo`, `active`, `permission_schedules`, `permission_users`, `permission_vehicles`)
	values ('John Doe', 'user2', '1234', 'john.doe@eiger.com', 78706861318, '99360672', 98563485925, '2017-09-22', 'Management', '02.jpg', true, false, false, true);
insert into `user` (`name`, `login`, `pass`, `email`, `cpf`, `phone`, `driver_license`, `driver_license_exp`, `department`, `photo`, `active`, `permission_schedules`, `permission_users`, `permission_vehicles`)
	values ('Jane Roe', 'user3', 'abcd', 'jane.roe@eiger.com', 69572325221, '99367372', 77785563214, '2019-01-10', 'Accounting', '03.jpg', true, false, false, false);


-- *Registering some vehicles:
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`, `active`)
	values ('V12 Vantage Coupe', 'BGQ8456', 2016, 'Sport', '56281020499','Audi', '01.jpg', true);
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`, `active`)
	values ('CRV', 'MWL1385', 2011, 'SUV', '46778167745', 'Honda', '02.jpg', true);
insert into `vehicle` (`title`, `plate`, `year`, `type`, `renavam`, `manufacturer`, `photo`, `active`)
	values ('New Fiesta Hatch', 'JVH3845', 2013, 'Hatch Médio', '38164557560', 'Ford', '03.jpg', true);


-- *Booking new schedules:
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, adddate(now(), interval 20 hour), adddate(now(), interval 22 hour), 'Duis aute irure dolor in reprehenderit', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, adddate(now(), interval 25 hour), adddate(now(), interval 26 hour), 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, adddate(now(), interval 10 hour), adddate(now(), interval 15 hour), 'Cillum dolore eu fugiat nulla pariatur', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, adddate(now(), interval 05 hour), adddate(now(), interval 09 hour), 'Aliquip ex ea commodo consequat', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 3, adddate(now(), interval 32 hour), adddate(now(), interval 50 hour), 'Ut enim ad minim veniam', 3);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, adddate(now(), interval 55 hour), adddate(now(), interval 62 hour), 'Quis nostrud exercitation ullamco', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 3, adddate(now(), interval 72 hour), adddate(now(), interval 87 hour), 'Non proident', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 3, adddate(now(), interval 90 hour), adddate(now(), interval 105 hour), 'Officia deserunt mollit', 3);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, adddate(now(), interval 108 hour), adddate(now(), interval 110 hour), 'Sunt in culpa', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, adddate(now(), interval 120 hour), adddate(now(), interval 132 hour), 'Cillum dolore eu fugiat nulla', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, adddate(now(), interval 138 hour), adddate(now(), interval 145 hour), 'Reprehenderit in voluptate', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 3, adddate(now(), interval 150 hour), adddate(now(), interval 163 hour), 'Aute irure dolor', 3);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 2, adddate(now(), interval 164 hour), adddate(now(), interval 166 hour), 'Velit esse cillum dolore eu fugiat nulla pariatu', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (1, 1, adddate(now(), interval 167 hour), adddate(now(), interval 172 hour), 'Commodo consequat', 1);

insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (2, 3, adddate(now(), interval 02 hour), adddate(now(), interval 08 hour), 'Sed do eiusmod tempor incididunt ut labore', 3);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (2, 1, adddate(now(), interval 09 hour), adddate(now(), interval 15 hour), 'Esse cillum dolore eu fugiat', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (2, 3, adddate(now(), interval 18 hour), adddate(now(), interval 27 hour), 'Laboris nisi ut aliquip', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (2, 2, adddate(now(), interval 32 hour), adddate(now(), interval 40 hour), 'Adipisicing elit, sed do', 2);

insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (3, 2, adddate(now(), interval 48 hour), adddate(now(), interval 72 hour), 'Culpa qui officia deserunt', 1);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (3, 2, adddate(now(), interval 02 hour), adddate(now(), interval 03 hour), 'Mollit anim id est laborum', 2);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (3, 3, adddate(now(), interval 80 hour), adddate(now(), interval 83 hour), 'Fugiat nulla pariatur', 3);
insert into `schedule` (`id_vehicle_fk`, `id_user_fk`, `start_date`, `end_date`, `reason`, `id_user_owner_fk`)
				values (3, 1, adddate(now(), interval 84 hour), adddate(now(), interval 90 hour), 'Dolor in reprehenderit', 1);