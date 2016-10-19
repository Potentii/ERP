drop schema if exists `eiger_schema`;
create schema if not exists `eiger_schema`;
use `eiger_schema`;

drop table if exists `vehicle`;
drop table if exists `user`;
drop table if exists `user_permission`;
drop table if exists `permission`;
drop table if exists `schedule`;
drop table if exists `auth`;



create table if not exists `vehicle`(
	`id` 			BIGINT unsigned not null auto_increment unique,
	`title` 		TEXT not null,
	`plate` 		VARCHAR(7) not null unique,
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
	`id` 		BIGINT unsigned not null auto_increment unique,
    `name` 		TEXT not null,
	`login` 	VARCHAR(20) not null unique,
    `pass`		VARCHAR(20) not null,
    `email`		TEXT not null,
    `cpf`		TEXT not null,
    `phone`		TEXT not null,
    `admin`		BOOLEAN not null,
    `active` 	BOOLEAN not null,
    `date` 		DATETIME not null default now(),

	primary key(`id`)
);


create table if not exists `schedule`(
	`id` 				BIGINT unsigned not null auto_increment unique,
	`id_vehicle_fk` 	BIGINT unsigned not null,
    `id_user_fk` 		BIGINT unsigned not null,
    `start_date` 		DATETIME not null,
    `end_date` 			DATETIME not null,
    `reason` 			TEXT,
    `id_user_owner_fk` 	BIGINT unsigned not null,
    `date` 				DATETIME default now(),

    foreign key(`id_vehicle_fk`) references `vehicle`(`id`),
    foreign key(`id_user_fk`) references `user`(`id`),
	foreign key(`id_user_owner_fk`) references `user`(`id`),
    
    primary key (`id`)

);


create table if not exists `permission`(
	`id` 	BIGINT unsigned not null auto_increment unique,
    `title` VARCHAR(16) not null unique,
    `date` 	DATETIME not null default now(),

    primary key (`id`)

);


create table if not exists `user_permission`(
	`id` 				BIGINT unsigned not null auto_increment unique,
    `id_user_fk` 		BIGINT unsigned not null,
    `id_permission_fk` 	BIGINT unsigned not null,
    `date` 				DATETIME not null default now(),

    foreign key(`id_user_fk`) references `user`(`id`) on delete cascade,
    foreign key(`id_permission_fk`) references `permission`(`id`) on delete cascade,

    primary key(`id`)

);


create table if not exists `auth`(
	`token`	VARCHAR(36) not null unique,
	`key`	VARCHAR(20) not null,
	`date`	DATETIME not null default now(),

	foreign key(`key`) references `user`(`login`)
);
