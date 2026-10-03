CREATE DATABASE achess; 

USE achess;

-- Tables
CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    profileImage VARCHAR(125)
);

CREATE TABLE user_info(
	user_id INT,
    user_rank ENUM('Wood', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum-1', 'Platinum-2', 'Diamond', 'Master', 'Grand-Master', 'Titan') DEFAULT 'Silver',
    user_points INT DEFAULT 1500,
    game_mode ENUM('normal', 'funny') DEFAULT 'normal',
    game_time ENUM('rapid', 'blitz', 'bullet') DEFAULT 'blitz',
    PRIMARY KEY (user_id, game_mode, game_time),
    KEY userID(user_id),
    CONSTRAINT userID FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_config(
  user_id INT,
    pieces VARCHAR(31) DEFAULT 'square',
    board VARCHAR(31) DEFAULT 'green-board',
    KEY userID2(user_id),
    CONSTRAINT userID2 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE games(
	id INT AUTO_INCREMENT PRIMARY KEY,
    timer VARCHAR(2),
    moves TEXT NOT NULL,
    user_id_light INT,
    user_id_black INT,
    if_draw BOOLEAN NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY userID_Light(user_id_light),
    CONSTRAINT userID_Light FOREIGN KEY(user_id_light) REFERENCES users(id) ON DELETE CASCADE,
    KEY userID_Black(user_id_black),
    CONSTRAINT userID_Black FOREIGN KEY(user_id_black) REFERENCES users(id) ON DELETE CASCADE
);

-- Procedures
DELIMITER $$
CREATE PROCEDURE createUser(
	IN _username VARCHAR(255),
    IN _email VARCHAR(255),
    IN _password VARCHAR(255)
)

BEGIN
	DECLARE userId INT;
    
    INSERT INTO users(username, email, password) VALUES(_username, _email, _password);
    SELECT id INTO userId FROM users WHERE username=_username;

    INSERT INTO user_info (user_id, game_mode, game_time)
    VALUES
        (userId, 'normal', 'bullet'),
        (userId, 'normal', 'blitz'),
        (userId, 'normal', 'rapid'),
        (userId, 'funny', 'bullet'),
        (userId, 'funny', 'blitz'),
        (userId, 'funny', 'rapid');

    INSERT INTO user_config (user_id, pieces, board)
    VALUES
        (userId, 'square', 'green-board');

END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE updateScores(
	  IN username_1 VARCHAR(255),
    IN points_1 INT,
    IN username_2 VARCHAR(255),
    IN points_2 INT,
    IN gameMode VARCHAR(10),
    IN gameTime VARCHAR(10)
)

BEGIN
	  DECLARE userId_1 INT;
    DECLARE userId_2 INT;
    DECLARE user_rank_1 VARCHAR(20) DEFAULT "Silver";
    DECLARE user_rank_2 VARCHAR(20) DEFAULT "Silver";
    
    SELECT id INTO userId_1 FROM users WHERE username=username_1;
    SELECT id INTO userId_2 FROM users WHERE username=username_2;
    
    IF points_1 < 500 THEN
		SET user_rank_1 := "Wood";
	ELSEIF points_1 < 1000 THEN
		SET user_rank_1 := "Iron";
	ELSEIF points_1 < 1400 THEN
		SET user_rank_1 := "Bronze";
    ELSEIF points_1 < 1800 THEN
		SET user_rank_1 := "Silver";
    ELSEIF points_1 < 2100 THEN
		SET user_rank_1 := "Gold";
    ELSEIF points_1 < 2400 THEN
		SET user_rank_1 := "Platinum-1";
    ELSEIF points_1 < 2550 THEN
		SET user_rank_1 := "Platinum-2";
    ELSEIF points_1 < 2650 THEN
		SET user_rank_1 := "Diamond";
    ELSEIF points_1 < 2800 THEN
		SET user_rank_1 := "Master";
    ELSEIF points_1 < 2900 THEN
		SET user_rank_1 := "Grand-Master";  
	ELSE
		SET user_rank_1 := "Titan";
	END IF;
    
    IF points_2 < 500 THEN
		SET user_rank_2 := "Wood";
	ELSEIF points_2 < 1000 THEN
		SET user_rank_2 := "Iron";
	ELSEIF points_2 < 1400 THEN
		SET user_rank_2 := "Bronze";
    ELSEIF points_2 < 1800 THEN
		SET user_rank_2 := "Silver";
    ELSEIF points_2 < 2100 THEN
		SET user_rank_2 := "Gold";
    ELSEIF points_2 < 2400 THEN
		SET user_rank_2 := "Platinum-1";
    ELSEIF points_2 < 2550 THEN
		SET user_rank_2 := "Platinum-2";
    ELSEIF points_2 < 2650 THEN
		SET user_rank_2 := "Diamond";
    ELSEIF points_2 < 2800 THEN
		SET user_rank_2 := "Master";
    ELSEIF points_2 < 2900 THEN
		SET user_rank_2 := "Grand-Master";  
	ELSE
		SET user_rank_2 := "Titan";
	END IF;
    
    UPDATE user_info SET user_points=points_1, user_rank=user_rank_1 WHERE user_id=userId_1
     AND game_mode = gameMode AND game_time = gameTime;
    UPDATE user_info SET user_points=points_2, user_rank=user_rank_2 WHERE user_id=userId_2 
     AND game_mode = gameMode AND game_time = gameTime;

END $$
DELIMITER ;

SELECT * FROM users;
SELECT * FROM user_info;
SELECT * FROM games;