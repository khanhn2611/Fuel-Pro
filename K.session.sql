-- @block
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profileComplete BOOLEAN
);

-- @block
SELECT * FROM Users;

-- @block
CREATE TABLE UserInformation (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    fullName VARCHAR(255) NOT NULL,
    address1 VARCHAR(255) NOT NULL,
    address2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zipcode VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(ID)
);

-- @block
SELECT * FROM UserInformation;

-- @block
DROP TABLE UserInformation;