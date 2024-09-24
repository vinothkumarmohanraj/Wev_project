-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 07, 2024 at 02:22 PM
-- Server version: 5.7.34
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exchange`
--

-- --------------------------------------------------------

--
-- Table structure for table `price_log`
--

CREATE TABLE `price_log` (
  `id` int(11) NOT NULL,
  `pair` varchar(10) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `open` float(18,4) NOT NULL,
  `high` float(18,4) NOT NULL,
  `low` float(18,4) NOT NULL,
  `close` float(18,4) NOT NULL,
  `volume` float(18,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `price_log`
--

INSERT INTO `price_log` (`id`, `pair`, `timestamp`, `open`, `high`, `low`, `close`, `volume`) VALUES
(1, 'BTCUSDT', 1725679873, 53000.0000, 55000.0000, 50000.0000, 57000.0000, 2.0000),
(2, 'BTCUSDT', 1725679926, 53000.0000, 58000.0000, 50000.0000, 58000.0000, 1.0000),
(3, 'btcusdt', 1725717969, 55000.0000, 55000.0000, 55000.0000, 55000.0000, 1.1000),
(4, 'btcusdt', 1725718019, 57000.0000, 57000.0000, 57000.0000, 57000.0000, 6.0000),
(5, 'btcusdt', 1725718033, 60000.0000, 60000.0000, 60000.0000, 60000.0000, 8.0000),
(6, 'btcusdt', 1725718095, 53000.0000, 53000.0000, 53000.0000, 53000.0000, 12.0000),
(8, 'btcusdt', 1725718865, 51000.0000, 51000.0000, 51000.0000, 51000.0000, 10123.0000),
(9, 'btcusdt', 1725718893, 48000.0000, 48000.0000, 48000.0000, 48000.0000, 123.0000);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pair` varchar(10) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '0-Buy 1-Sell',
  `req_price` float NOT NULL,
  `req_quantity` float NOT NULL,
  `total` float NOT NULL,
  `createtime` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '0-Pending 1-Processed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `pair`, `type`, `req_price`, `req_quantity`, `total`, `createtime`, `status`) VALUES
(1, 1, 'btcusdt', 0, 53000, 1.2, 60000, 1725679873, 0),
(2, 1, 'btcusdt', 1, 54000, 3, 162000, 1725679873, 0),
(3, 1, 'btcusdt', 0, 55000, 1.2, 66000, 1725717293, 0),
(4, 1, 'btcusdt', 0, 53000, 1.2, 63600, 1725717308, 0),
(5, 1, 'btcusdt', 0, 55000, 1.1, 60500, 1725717969, 0),
(6, 1, 'btcusdt', 0, 57000, 6, 342000, 1725718019, 0),
(7, 1, 'btcusdt', 0, 60000, 8, 480000, 1725718033, 0),
(8, 1, 'btcusdt', 1, 53000, 12, 636000, 1725718095, 0),
(9, 1, 'btcusdt', 0, 54000, 12, 648000, 1725718526, 0),
(10, 1, 'btcusdt', 0, 54000, 12, 648000, 1725718568, 0),
(12, 1, 'btcusdt', 0, 51000, 10123, 516273000, 1725718865, 0),
(13, 1, 'btcusdt', 1, 48000, 123, 5904000, 1725718893, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `price_log`
--
ALTER TABLE `price_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `price_log`
--
ALTER TABLE `price_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
