-- https://onlinehelp.tableau.com/current/pro/online/mac/en-us/customsql.html
-- remove these comments or the query will fail
SELECT kr.DR AS neerslag, COUNT(s.`RDT-ID`) AS `station storingen`
FROM (([KNMI_stations.csv] ks
INNER JOIN [KNMI_results.csv] kr ON kr.STN = ks.STN)
INNER JOIN [traject_station.csv] ts ON ts.station = ks.Name)
INNER JOIN [storingen.csv] s ON s.`Traject (NS)` = ts.traject
WHERE NOT kr.DR = 0
AND kr.YYYYMMDD = s.YYYYMMDD
GROUP BY kr.DR
