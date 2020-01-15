CREATE DATABASE atcorapothiki;
DROP DATABASE atcorapothiki;

CREATE TABLE Tests(  
    test_id INT NOT NULL AUTO_INCREMENT,  
    test_name VARCHAR(100) NOT NULL,  
    test_address VARCHAR(40) NOT NULL,  
    test_date DATE,  
    PRIMARY KEY ( test_id ));  
    
#Users   
CREATE USER 'atcor'@'localhost' IDENTIFIED BY 'spot802';   			
GRANT USAGE ON *.* TO 'atcor'@'localhost' IDENTIFIED BY 'spot802';
GRANT ALL PRIVILEGES ON `atcorapothiki`.* TO 'atcor'@'localhost';  
FLUSH PRIVILEGES;	 

CREATE USER 'atcorUser'@'localhost' IDENTIFIED BY 'atcor802';   
GRANT USAGE ON *.* TO 'atcorUser'@'localhost' IDENTIFIED BY 'atcor802';
GRANT ALL PRIVILEGES ON `atcorapothiki`.* TO 'atcorUser'@'localhost';  


###Queries
#Entities
SELECT * FROM atcorapothiki.Items;
SELECT * FROM atcorapothiki.Tasks;
SELECT * FROM atcorapothiki.Invoices;	
SELECT * FROM atcorapothiki.InvoiceItems;
SELECT * FROM atcorapothiki.RFMs;
#SELECT * FROM atcorapothiki.RFMItems;

SELECT * FROM atcorapothiki.TaskItems;
SELECT * FROM atcorapothiki.TaskItemMovements;
SELECT * FROM atcorapothiki.TaskInvoiceItems;
use atcorapothiki;
SELECT `atcorId`, `name`, `totalStock`, `nsn`, `category`, `material`, `measurement`, `VAT`, `location`, `dexion` FROM `Items` AS `Item`;

#JoinTables
SELECT * FROM atcorapothiki.InvoiceItems;

	SELECT t.taskName, t.id as taskId,  r.RFMCode, r.id as rfmId, ri.itemId, i.name, ri.matOut FROM atcorapothiki.Tasks as t
	LEFT JOIN atcorapothiki.RFMs as r ON r.taskId = t.id
	LEFT JOIN atcorapothiki.RFMItems as ri ON ri.rfmId = r.id
	LEFT JOIN atcorapothiki.Items as i ON i.id = r.id;
SELECT * FROM atcorapothiki.TaskInvoiceItems;

	SELECT  t.id as taskId, t.taskName, i.id as itemId, i.name, d.invoice, di.priceIn, di.totalDocMatInQnt, ti.taskDocItemOutQnt, ti.taskDocItemOutDate 
	FROM atcorapothiki.Tasks as t
	LEFT JOIN atcorapothiki.TaskInvoiceItems as ti ON ti.TaskId = t.id
	LEFT JOIN atcorapothiki.InvoiceItems as di ON di.id = ti.invoiceItemId
	LEFT JOIN atcorapothiki.Invoices as d ON d.id = di.invoiceId
	LEFT JOIN atcorapothiki.Items as i ON i.id = di.itemId;


