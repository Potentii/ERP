-- *Using utf8 as the default connection charset:
set names 'utf8';
-- *Using the 'eiger_schema':
use `eiger_schema`;



/**
 * Validates the schedule with the business logic before booking it
 */
drop trigger if exists `book_schedule`;
delimiter $$ 
create trigger `book_schedule` before insert on `schedule` for each row
begin

	declare `var_owner_permission_schedules` BOOLEAN;
    declare `var_owner_is_active` BOOLEAN;
    declare `var_user_is_active` BOOLEAN;
    declare `var_vehicle_is_active` BOOLEAN;
    declare `var_schedules_overlaping` INT;

    -- *Checking if it's starting the reservation before the ending date:
	if new.`start_date` > now() and new.`end_date` > new.`start_date` then
		-- *If it is:
		-- *Retrieving the owner's schedules permission and active status:
		select `permission_schedules`, `active` into `var_owner_permission_schedules`, `var_owner_is_active` from `user` where `id` = new.`id_user_owner_fk`;
        -- *Retrieving the referenced user's active status:
		select `active` into `var_user_is_active` from `user` where `id` = new.`id_user_fk`;
		-- *Retrieving the referenced vehicle's active status:
        select `active` into `var_vehicle_is_active` from `vehicle` where `id` = new.`id_vehicle_fk`;
        -- *Checking if the owner and the user are both active:
        if `var_owner_is_active` = true and `var_user_is_active` = true then
			-- *If they are:
			-- *Checking if the vehicle is active:
			if `var_vehicle_is_active` = true then
				-- *If it is:
				-- *Checking if the resource owner has schedules permission, or if it's the same as referenced on this reservation:
				if `var_owner_permission_schedules` = true or new.`id_user_owner_fk` = new.`id_user_fk` then
					-- *If it is:
					-- *Querying for date overlaps, by comparing the existing schedules for this vehicle with the given reservation period:
					select count(*) into `var_schedules_overlaping` from `schedule`
						where `id_vehicle_fk` = new.`id_vehicle_fk`
						and new.`start_date` <= `end_date`
						and new.`end_date` >= `start_date`;
					-- *Checking if there is some overlap on the given dates:
					if `var_schedules_overlaping` > 0 then
						-- *If there is:
						-- *Throwing an error:
						signal SQLSTATE '45000' set message_text = 'EIGER_VEHICLE_UNAVAILABLE';
					end if;
				else
					-- *If it isn't:
					-- *Throwing an error:
					signal SQLSTATE '45000' set message_text = 'EIGER_NOT_AUTHORIZED';
				end if;
			else
				-- *If it isn't:
				-- *Throwing an error:
				signal SQLSTATE '45000' set message_text = 'EIGER_VEHICLE_NOT_ACTIVE';
			end if;
        else
			-- *If they aren't:
			-- *Throwing an error:
			signal SQLSTATE '45000' set message_text = 'EIGER_USER_NOT_ACTIVE';
		end if;
	else
		-- *If it isn't:
        -- *Throwing an error:
		signal SQLSTATE '45000' set message_text = 'EIGER_INVALID_DATE';
	end if;
end$$
delimiter ;



/**
 * Validates the new schedule informations with the business logic
 */
drop trigger if exists `modify_schedule`;
delimiter $$ 
create trigger `modify_schedule` before update on `schedule` for each row
begin

	declare `var_owner_permission_schedules` BOOLEAN;
    declare `var_owner_is_active` BOOLEAN;
    declare `var_user_is_active` BOOLEAN;
    declare `var_vehicle_is_active` BOOLEAN;
    declare `var_schedules_overlaping` INT;

    -- *Checking if it's starting the reservation before the ending date:
	if new.`start_date` > now() and new.`end_date` > new.`start_date` then
		-- *If it is:
        -- *Retrieving the owner's schedules permission and active status:
		select `permission_schedules`, `active` into `var_owner_permission_schedules`, `var_owner_is_active` from `user` where `id` = new.`id_user_owner_fk`;
        -- *Retrieving the referenced user's active status:
		select `active` into `var_user_is_active` from `user` where `id` = new.`id_user_fk`;
        -- *Retrieving the referenced vehicle's active status:
        select `active` into `var_vehicle_is_active` from `vehicle` where `id` = new.`id_vehicle_fk`;
        -- *Checking if the owner and the user are both active:
        if `var_owner_is_active` = true and `var_user_is_active` = true then
			-- *If they are:
			-- *Checking if the vehicle is active:
			if `var_vehicle_is_active` = true then
				-- *If it is:
				-- *Checking if the resource owner has schedules permission, but if it is the one as referenced in this reservation, checking if they not changed the user or the owner:
				if (`var_owner_permission_schedules` = true) or (new.`id_user_owner_fk` = new.`id_user_fk` and old.`id_user_fk` = new.`id_user_fk`) then
					-- *If it is:
					set new.`id_user_owner_fk` = old.`id_user_owner_fk`;
					-- *Querying for date overlaps, by comparing the existing schedules for this vehicle with the given reservation period (excluding this reservation itself):
					select count(*) into `var_schedules_overlaping` from `schedule`
						where `id_vehicle_fk` = new.`id_vehicle_fk`
						and `id` != old.`id`
						and new.`start_date` <= `end_date`
						and new.`end_date` >= `start_date`;
					-- *Checking if there is some overlap on the given dates:
					if `var_schedules_overlaping` > 0 then
						-- *If there is:
						-- *Throwing an error:
						signal SQLSTATE '45000' set message_text = 'EIGER_VEHICLE_UNAVAILABLE';
					end if;
				else
					-- *If it isn't:
					-- *Throwing an error:
					signal SQLSTATE '45000' set message_text = 'EIGER_NOT_AUTHORIZED';
				end if;
			else
				-- *If it isn't:
				-- *Throwing an error:
				signal SQLSTATE '45000' set message_text = 'EIGER_VEHICLE_NOT_ACTIVE';
			end if;
        else
			-- *If they aren't:
			-- *Throwing an error:
			signal SQLSTATE '45000' set message_text = 'EIGER_USER_NOT_ACTIVE';
		end if;
	else
		-- *If it isn't:
        -- *Throwing an error:
		signal SQLSTATE '45000' set message_text = 'EIGER_INVALID_DATE';
	end if;
end$$
delimiter ;



/**
 * Removes all user's tokens if they become inactive after an update
 */
drop trigger if exists `inactive_user_logoff`;
delimiter $$ 
create trigger `inactive_user_logoff` after update on `user` for each row
begin
	-- *Checking if the active status has changed and if it's false now:
    if old.`active` != new.`active` and new.`active` = 0 then
		-- *If it is:
        -- *Removing all access tokens from this user, so they cannot log into the system:
		delete from `auth` where `key` = old.`login`;
    end if;
end$$
delimiter ;
