CREATE TYPE scene_type AS ENUM ('workplace', 'family', 'relationship', 'daily');
CREATE TYPE plan AS ENUM ('single', 'pack10', 'unlimited');

CREATE TABLE users (
	wallet_address varchar(42) PRIMARY KEY NOT NULL,
	credits integer DEFAULT 3 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE generations (
	id varchar(25) PRIMARY KEY NOT NULL,
	wallet_address varchar(42) NOT NULL,
	scenario text NOT NULL,
	scene_type scene_type NOT NULL,
	intensity integer NOT NULL,
	output jsonb,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT generations_wallet_address_users_wallet_address_fk
		FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE payments (
	tx_hash varchar(66) PRIMARY KEY NOT NULL,
	wallet_address varchar(42) NOT NULL,
	plan plan NOT NULL,
	amount_usdt numeric(10,2) NOT NULL,
	verified_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT payments_wallet_address_users_wallet_address_fk
		FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
		ON DELETE NO ACTION ON UPDATE NO ACTION
);