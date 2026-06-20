CREATE TABLE `checklistRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('po','capsula','gel') NOT NULL,
	`productName` varchar(255) NOT NULL,
	`client` varchar(255) NOT NULL,
	`formulationCode` varchar(255) NOT NULL,
	`accompanimentReason` varchar(100),
	`productionDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `checklistRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidencePhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`photoUrl` text NOT NULL,
	`photoKey` varchar(500),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidencePhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mixingProcessData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`mixerUsed` varchar(255),
	`mixingOrder` text,
	`roomTemperature` text,
	`relativeHumidity` text,
	`mixingTime` text,
	`initialTankTemperature` text,
	`viscTempTankViscosity` text,
	`viscTempTankTemperature` text,
	`viscTempTankRpm` text,
	`viscTempTankTorque` text,
	`viscTempTankSpindle` text,
	`visc1Viscosity` text,
	`visc1Temperature` text,
	`visc1Rpm` text,
	`visc1Torque` text,
	`visc1Spindle` text,
	`visc2Viscosity` text,
	`visc2Temperature` text,
	`visc2Rpm` text,
	`visc2Torque` text,
	`visc2Spindle` text,
	`densityMixing1` text,
	`densityMixing2` text,
	`densityMixing3` text,
	`densityMixingAverage` text,
	`occurrence` varchar(10),
	`heatedPulmonaryTank` varchar(10),
	`observations` text,
	`scoopConform` varchar(20),
	`sensorialReleased` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mixingProcessData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packagingProcessData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`data` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `packagingProcessData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postProductionData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`data` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `postProductionData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preProductionData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`developmentNeeded` varchar(10),
	`orderConference` varchar(50),
	`conferenceDate` timestamp,
	`datasulCode` varchar(100),
	`packaging1` varchar(20),
	`packaging2` varchar(20),
	`packaging3` varchar(20),
	`shippingBox` varchar(20),
	`label` varchar(20),
	`scoop` varchar(20),
	`densityTest1` text,
	`densityTest2` text,
	`densityTest3` text,
	`densityAverage` text,
	`observations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `preProductionData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `responsiblePersonnel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`qualityResponsible` varchar(255) NOT NULL,
	`innovationResponsible` varchar(255) NOT NULL,
	`innovationVerification` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `responsiblePersonnel_id` PRIMARY KEY(`id`)
);
