-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 05, 2021 at 09:35 AM
-- Server version: 5.7.35
-- PHP Version: 7.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cad_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ambulance_info`
--

CREATE TABLE `ambulance_info` (
  `id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `current_ticket` int(11) NOT NULL DEFAULT '0',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1805 Medical Center Dr, San Bernardino, CA 92411 	',
  `loclat` double NOT NULL DEFAULT '34.1313185',
  `loclng` double NOT NULL DEFAULT '-117.3209714',
  `destination` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `dstlat` double NOT NULL DEFAULT '0',
  `dstlng` double NOT NULL DEFAULT '0',
  `directions` mediumtext COLLATE utf8mb4_unicode_ci,
  `distance` tinytext COLLATE utf8mb4_unicode_ci,
  `duration` tinytext COLLATE utf8mb4_unicode_ci,
  `lastupdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ambulance_status`
--

CREATE TABLE `ambulance_status` (
  `id` tinyint(1) NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ambulance_status`
--

INSERT INTO `ambulance_status` (`id`, `name`) VALUES
(0, 'Out of Service'),
(1, 'Available'),
(2, 'Enroute'),
(3, 'Unavailable');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(1) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` double NOT NULL DEFAULT '0',
  `lng` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `location`, `lat`, `lng`) VALUES
(1, 'Community Hospital(Dignity)', '1805 Medical Center Dr, San Bernardino, CA 92411', 34.1313185, -117.3209714),
(2, 'St. Bernardine(Dignity)', '2101 N Waterman Ave, San Bernardino, CA 92404', 34.1347931, -117.2769992),
(3, 'Arrowhead Regional MC', '400 N Pepper Ave, Colton, CA 92324', 34.0752955, -117.3512727),
(4, 'Loma Linda University ER', '11234 Anderson St, Loma Linda, CA 92354', 34.050036, -117.2638456),
(5, 'Redlands Community Hospital', '350 Terracina Blvd, Redlands, CA 92373', 34.0367064, -117.2058328);

-- --------------------------------------------------------

--
-- Table structure for table `incident_tbl`
--

CREATE TABLE `incident_tbl` (
  `id` int(4) NOT NULL,
  `ack` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incident_tbl`
--

INSERT INTO `incident_tbl` (`id`, `ack`, `description`) VALUES
(1, 'AAIR', 'Aircraft crash'),
(2, 'ABDO', 'Abdominal Pain'),
(3, 'ABOT', 'Accident involving a Boat'),
(4, 'ACBD', 'Accident involving a building'),
(5, 'ACBI', 'Accident involving a Bicycle'),
(6, 'ACMC', 'Accident involving a motorcycle'),
(7, 'ACPE', 'Accident involving a pedestrian'),
(8, 'ACPI', 'Accident with Injury'),
(9, 'ACPN', 'Accident, pinned'),
(10, 'ACWA', 'Accident in water'),
(11, 'ALLR', 'Allergic Reaction'),
(12, 'AMPU', 'Amputation'),
(13, 'ANSH', 'Anaphylactic Shock'),
(14, 'ASTA', 'Airport alert'),
(15, 'BACK', 'Back Pain'),
(16, 'BITE', 'Animal Bite'),
(17, 'BLED', 'Bleeding'),
(18, 'BREA', 'Breathing Difficulty'),
(19, 'BTSD', 'Boat in Distress'),
(20, 'BURN', 'Burn'),
(21, 'CARD', 'Cardiac'),
(22, 'CHOK', 'Choking'),
(23, 'COLD', 'Cold Exposure'),
(24, 'CRED', 'Cardiac Arrest'),
(25, 'DIAB', 'Diabetic'),
(26, 'DRIP', 'Drowning in Pool'),
(27, 'DRWN', 'Drowning'),
(28, 'EXPN', 'Explosion'),
(29, 'FALL', 'Fall'),
(30, 'FIRE', 'Assist Fire'),
(31, 'FRAC', 'Fracture'),
(32, 'GNWD', 'Gunshot Wound'),
(33, 'HEAD', 'Headache'),
(34, 'HEAT', 'Heat'),
(35, 'INJY', 'Injury'),
(36, 'LIFT', 'Lift assist'),
(37, 'MAID', 'Mutual Aid'),
(38, 'MATY', 'Maternity'),
(39, 'MEDA', 'Medical Alarm'),
(40, 'MNTL', 'Mental'),
(41, 'OVDO', 'Overdose'),
(42, 'POIS', 'Poisoning'),
(43, 'RAPE', 'Rape'),
(44, 'SEIZ', 'Seizure'),
(45, 'SICK', 'Illness'),
(46, 'STAB', 'Stabbing'),
(47, 'STRO', 'Stroke'),
(48, 'SUIC', 'Suicide'),
(49, 'TRAN', 'Interfacility Transport'),
(50, 'UNCO', 'Unconscious'),
(51, 'UNRQ', 'Unknown request for rescue');

-- --------------------------------------------------------

--
-- Table structure for table `map_styles`
--

CREATE TABLE `map_styles` (
  `id` tinyint(1) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `style` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `map_styles`
--

INSERT INTO `map_styles` (`id`, `name`, `style`) VALUES
(1, 'None', ''),
(2, 'Night', '26e215b11471f8b0'),
(3, 'Retro', 'de7a60bcb706b08f'),
(4, 'Aubergine', 'cfb41772e69a897e');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` double NOT NULL DEFAULT '0',
  `lng` double NOT NULL DEFAULT '0',
  `incident_type` int(4) NOT NULL,
  `priority` tinyint(1) NOT NULL,
  `ambulance` int(11) NOT NULL DEFAULT '0',
  `dispatcher` int(11) NOT NULL DEFAULT '0',
  `enroute_to_hospital` int(2) NOT NULL DEFAULT '0',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cleared` timestamp NULL DEFAULT NULL,
  `comments` longtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `ticket`
--
DELIMITER $$
CREATE TRIGGER `ambo_delete` BEFORE DELETE ON `ticket` FOR EACH ROW UPDATE ambulance_info SET status=1, current_ticket=0, destination = '', dstlat=0, dstlng=0,directions=NULL,distance=NULL,duration=NULL, lastupdate=NOW() WHERE id=OLD.ambulance
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `ambo_insert` AFTER INSERT ON `ticket` FOR EACH ROW UPDATE ambulance_info a, ticket b SET a.status = 2, a.current_ticket = NEW.id, a.destination = NEW.location, a.dstlat= NEW.lat, a.dstlng = NEW.lng, a.lastupdate = NOW() WHERE a.id = NEW.ambulance
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `ambo_update` AFTER UPDATE ON `ticket` FOR EACH ROW IF (NEW.active = 0 AND OLD.active = 1) THEN
UPDATE ambulance_info SET status = 1, current_ticket = 0, destination = '', dstlat=0, dstlng=0, directions = '', distance = '', duration = '', lastupdate = NOW() WHERE id = OLD.ambulance;
IF (NEW.cleared = 0) THEN
UPDATE ticket SET cleared = NOW();
END IF;
ELSEIF (NEW.active = 1 AND OLD.active = 1) THEN
UPDATE ambulance_info SET status = 2, current_ticket = NEW.id, destination = NEW.location, dstlng = NEW.lng, dstlat= NEW.lat, lastupdate = NOW() WHERE id = NEW.ambulance;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash_pw` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` int(1) NOT NULL,
  `preferred_map` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ambulance_info`
--
ALTER TABLE `ambulance_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `current_ticket` (`current_ticket`);

--
-- Indexes for table `ambulance_status`
--
ALTER TABLE `ambulance_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `incident_tbl`
--
ALTER TABLE `incident_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ack` (`ack`);

--
-- Indexes for table `map_styles`
--
ALTER TABLE `map_styles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incident_type` (`incident_type`),
  ADD KEY `ambulance` (`ambulance`,`dispatcher`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `user_type` (`user_type`),
  ADD KEY `preferred_map` (`preferred_map`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `incident_tbl`
--
ALTER TABLE `incident_tbl`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `map_styles`
--
ALTER TABLE `map_styles`
  MODIFY `id` tinyint(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
