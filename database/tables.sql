drop schema if exists `eiger_schema`;
create schema if not exists `eiger_schema`;
use `eiger_schema`;

drop table if exists `vehicle`;
drop table if exists `user`;
drop table if exists `schedule`;
drop table if exists `auth`;



create table if not exists `vehicle`(
	`id` 			BIGINT unsigned not null auto_increment unique,
	`title` 		TEXT not null,
	`plate` 		VARCHAR(7) not null,
	`year` 			INTEGER not null,
	`type`			TEXT not null,
	`renavam` 		VARCHAR(11) not null unique,
	`manufacturer` 	TEXT not null,
	`photo`			TEXT,
    `active` 		BOOLEAN not null,
	`date` 			DATETIME not null default now(),

	primary key(`id`)
);


create table if not exists `user`(
	`id` 					BIGINT unsigned not null auto_increment unique,
    `name` 					TEXT not null,
	`login` 				VARCHAR(20) not null unique,
    `pass`					VARCHAR(20) not null,
    `email`					TEXT not null,
    `cpf`					VARCHAR(11) not null,
    `phone`					TEXT not null,
    `driver_license` 		VARCHAR(11) not null unique,
    `driver_license_exp` 	DATE not null,
    `department`			TEXT not null,
    `photo`					TEXT,
    `active` 				BOOLEAN not null,
    `permission_schedules`	BOOLEAN not null,
    `permission_users`		BOOLEAN not null,
    `permission_vehicles`	BOOLEAN not null,
    `date` 					DATETIME not null default now(),

	primary key(`id`)
);


create table if not exists `schedule`(
	`id` 				BIGINT unsigned not null auto_increment unique,
	`id_vehicle_fk` 	BIGINT unsigned not null,
    `id_user_fk` 		BIGINT unsigned not null,
    `start_date` 		DATETIME not null,
    `end_date` 			DATETIME not null,
    `reason` 			TEXT,
    `confirmed`			BOOLEAN not null default 0,
    `id_user_owner_fk` 	BIGINT unsigned not null,
    `date` 				DATETIME default now(),

    foreign key(`id_vehicle_fk`) references `vehicle`(`id`),
    foreign key(`id_user_fk`) references `user`(`id`),
	foreign key(`id_user_owner_fk`) references `user`(`id`),

    primary key (`id`)

);

create table if not exists `auth`(
	`token`	VARCHAR(36) not null unique,
	`key`	VARCHAR(20) not null,
	`date`	DATETIME not null default now(),

	foreign key(`key`) references `user`(`login`)
);
