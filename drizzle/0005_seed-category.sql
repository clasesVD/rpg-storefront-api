-- Custom SQL migration file, put your code below! --

SET session_replication_role = 'replica';

INSERT INTO category (id, name) VALUES
('0e92fe7f-78b0-419c-8102-e9ccbb34e3ae', 'Weapons'),
('ff0705ce-bfbd-43de-b83c-2596b1829f92', 'Daggers'),
('88d49b35-6993-4142-aeb1-fb87b8c676fd', 'Staffs'),
('b7d08798-0082-4fcf-bbb5-1f45c1593c65', 'Swords'),
('3c19580e-25d0-4a52-a470-8c517e20c1ae', 'Great Swords'),
('22a409b2-14ae-4e14-90b5-45282fa979eb', 'Bows'),
('c56f76f3-45f0-4b71-b3cc-7a01a01e47e3', 'Long Bows'),
('ab67ce00-12c3-4e29-986c-89629170be14', 'Short Swords'),
('04bc25d2-e4ff-4c13-baf2-c18f1c530e47', 'Materials'),
('41fc3214-11de-4aa9-b8f3-0b93009bc0a4', 'Mounts');
