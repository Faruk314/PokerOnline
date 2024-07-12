-- migrate:up

CREATE TABLE
    users (
        `userId` int NOT NULL AUTO_INCREMENT,
        `userName` varchar(50) NOT NULL,
        `image` varchar(255) DEFAULT NULL,
        `password` varchar(255) NOT NULL,
        `email` varchar(100) NOT NULL,
        PRIMARY KEY (`userId`)
);


-- migrate:down

DROP TABLE users;