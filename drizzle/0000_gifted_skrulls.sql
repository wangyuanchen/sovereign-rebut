CREATE TABLE `generations` (
	`id` varchar(25) NOT NULL,
	`wallet_address` varchar(42) NOT NULL,
	`scenario` text NOT NULL,
	`scene_type` enum('workplace','family','relationship','daily') NOT NULL,
	`intensity` int NOT NULL,
	`output` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`tx_hash` varchar(66) NOT NULL,
	`wallet_address` varchar(42) NOT NULL,
	`plan` enum('single','pack10','unlimited') NOT NULL,
	`amount_usdc` decimal(10,2) NOT NULL,
	`verified_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_tx_hash` PRIMARY KEY(`tx_hash`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`wallet_address` varchar(42) NOT NULL,
	`credits` int NOT NULL DEFAULT 3,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_wallet_address` PRIMARY KEY(`wallet_address`)
);
--> statement-breakpoint
ALTER TABLE `generations` ADD CONSTRAINT `generations_wallet_address_users_wallet_address_fk` FOREIGN KEY (`wallet_address`) REFERENCES `users`(`wallet_address`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_wallet_address_users_wallet_address_fk` FOREIGN KEY (`wallet_address`) REFERENCES `users`(`wallet_address`) ON DELETE no action ON UPDATE no action;