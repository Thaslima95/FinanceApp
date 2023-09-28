const express=require('express')
const mysql=require('mysql')
const cors=require('cors')
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();


const generatepdf = new(require('./sample'))()
const generatepdf2 = new(require('./sample2'))()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.json()) 


app.use(cors())
function generateShortRandomName() {
  const uuid = uuidv4();
  const shortName = uuid.replace(/-/g, '').substr(0, 10);
  return shortName;
}

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"aafiya.",
    database:"finance"

})

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

function numberToWords(number) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

    function convertChunk(num) {
        if (num === 0) {
            return '';
        } else if (num < 10) {
            return ones[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        }
    }

    if (number === 0) {
        return 'zero';
    }

    let result = '';
    let chunkCount = 0;
    while (number > 0) {
        const chunk = number % 1000;
        if (chunk > 0) {
            result = convertChunk(chunk) + ' ' + thousands[chunkCount] + ' ' + result;
        }
        number = Math.floor(number / 1000);
        chunkCount++;
    }

    return result.trim();
}


app.post('/addincome',(req,res)=>{
    console.log(req.body)
    const companyname=req.body.CompanyName;
    const streetaddress=req.body.StreetAddress;
    const city=req.body.City;
    const state=req.body.State;
    const pincode=req.body.Pincode;
    const placeofsupply=req.body.PlaceofSupply;
    const particulars=req.body.Particulars;
    const psyear=req.body.PSYear;
    const GSTN=req.body.GSTN;
    const GSTIN=req.body.GSTIN;
    const hsnsac=req.body.HSNSAC;
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const rate=req.body.Rate;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const balancedue=req.body.BalanceDue;
    const status=req.body.Status;
    const details=req.body.Items;
    const sql="INSERT INTO income_table (CompanyName,StreetAddress,City,State,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,CGST,SGST,IGST,TotalAmount,BalanceDue,`Status`,Items,ActionDate) VALUES ?";
    const value=[[companyname,streetaddress,city,state,pincode,placeofsupply,duedate,GSTN,GSTIN,particulars,psyear,hsnsac,rate,cgst,sgst,igst,totalamount,balancedue,status,details,actiondate]];
    db.query(sql,[value],(err,data)=>{
     if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
     let id=data.insertId;
     req.body.id=id;
     const randomFilename = generateShortRandomName() + '.pdf';
    generatepdf.mypdf([req.body],randomFilename)
    const sql=`UPDATE income_table SET InvoiceFile='Invoice${randomFilename}' where id=${id}`
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
         return res.status(200).json({"message":"Record Inserted"})
    })
      
})
    
})
app.put('/updateincome/:id',(req,res)=>{
    
const id=req.params.id;

const companyname=req.body.CompanyName;
    const streetaddress=req.body.StreetAddress;
    const city=req.body.City;
    const pincode=req.body.Pincode;
    const state=req.body.State;
    const placeofsupply=req.body.PlaceofSupply;
    const particulars=req.body.Particulars;
    const psyear=req.body.PSYear;
    const GSTN=req.body.GSTN;
    const GSTIN=req.body.GSTIN;
    const hsnsac=req.body.HSNSAC;
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const rate=req.body.Rate;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const balancedue=req.body.BalanceDue;
    const status=req.body.Status;
    const details=req.body.Items;
    const sql=`Select Status from income_table where id=${id}`;
    db.query(sql,(err,data)=>{
      if(err)
      {
         console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
      }
      const oldStatus=data[0].Status;
      console.log(oldStatus)
      if(req.body.Status=='Paid' && oldStatus=='UnPaid')
      {
        console.log("secondpdf")
        const sql=`Update income_table SET Status='Paid' where id=${id}`;
        db.query(sql,(err,data)=>{
             if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    const words=numberToWords(req.body.TotalAmount)
    const randomFilename = generateShortRandomName() + '.pdf';
    generatepdf2.mypdf2([req.body],words,randomFilename)
    const sql=`UPDATE income_table SET InvoiceFile='Invoice${randomFilename}' where id=${id}`
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
          if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Record not updated" });
    }
    res.status(200).json({status:200, message: "Record updated successfully" });
    })


        })
      }
      else{
        const sql="UPDATE income_table SET CompanyName=?,StreetAddress=?,City=?,State=?,Pincode=?,PlaceofSupply=?,GSTN=?,GSTIN=?,Particulars=?,PSYear=?,HSNSAC=?,Rate=?,DueDate=?,CGST=?,SGST=?,IGST=?,TotalAmount=?,BalanceDue=?,`Status`=?,Items=?,ActionDate=? where id=?";
db.query(sql,[companyname,streetaddress,city,state,pincode,placeofsupply,GSTN,GSTIN,particulars,psyear,hsnsac,rate,duedate,cgst,sgst,igst,totalamount,balancedue,status,details,actiondate,id],(err,data)=>{
     if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
     const randomFilename = generateShortRandomName() + '.pdf';
    generatepdf.mypdf([req.body],randomFilename)
    const sql=`UPDATE income_table SET InvoiceFile='Invoice${randomFilename}' where id=${id}`
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
          if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Record not updated" });
    }
    res.status(200).json({status:200, message: "Record updated successfully" });
    })
   
})

      }
    })

})

app.get('/getTotalIncomeRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from income_table where Status='Paid' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        return res.json(data)
    })
})

app.get('/getUnpaidTotalIncomeRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from income_table where Status='UnPaid' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        return res.json(data)
    })
})


app.get('/getincomedetails',(req,res)=>{
   
    const sql="Select id,CompanyName,StreetAddress,City,State,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,CGST,SGST,IGST,TotalAmount,BalanceDue,`Status`,Items,ActionDate,CreatedAt from income_table where IsDeleted=0";
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
       
        return res.json(data)
    })
})

app.get('/getsingleincomedetails/:id',(req,res)=>{
    
    const id=req.params.id;
    const sql=`Select id,CompanyName,StreetAddress,City,State,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,CGST,SGST,IGST,TotalAmount,BalanceDue,Status,Items,ActionDate,CreatedAt from income_table where id=${id}`;
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        
        return res.json(data)
    })
})

app.put('/deletesinglerecord/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`UPDATE income_table SET IsDeleted=1 where id=${id}`
    db.query(sql,(err,data)=>{
         if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
        
    })
})


app.post('/addexpense',(req,res)=>{
    console.log(req.body)
    const invoicenumber=req.body.InvoiceNumber;
    const particulars=req.body.Particulars;
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const paymentType=req.body.PaymentType;
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const sql="INSERT INTO expense_table (InvoiceNumber,Particulars,PaymentType,Amount,CGST,SGST,IGST,TotalAmount,DueDate,ActionDate) VALUES ?";
    const value=[[invoicenumber,particulars,paymentType,amount,cgst,sgst,igst,totalamount,duedate,actiondate]];
 db.query(sql,[value],(err,data)=>{
     if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    
    return res.status(200).json({"message":"Record Inserted"})
 })
   
    
})
app.put('/updateexpense/:id',(req,res)=>{
const id=req.params.id;
  const invoicenumber=req.body.InvoiceNumber;
    const particulars=req.body.Particulars;
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const paymentType=req.body.PaymentType;
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
const sql="UPDATE expense_table SET InvoiceNumber=?,Particulars=?,DueDate=?,PaymentType=?,Amount=?,CGST=?,SGST=?,IGST=?,TotalAmount=?,ActionDate=? where id=?";
db.query(sql,[invoicenumber,particulars,duedate,paymentType,amount,cgst,sgst,igst,totalamount,actiondate,id],(err,data)=>{
    if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
       if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Record not updated" });
    }
    res.status(200).json({ message: "Record updated successfully" });
})
})


app.get('/getDirectTotalExpenseRate',(req,res)=>{
    const sql="Select sum(TotalAmount) as Total from expense_table where PaymentType='Direct' and IsDeleted=0";
    db.query(sql,(err,data)=>{
        if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        return res.json(data)
    })
})

app.get('/getIndirectTotalExpenseRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from expense_table where PaymentType='Indirect' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
        if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        return res.json(data)
    })
})
app.get('/getexpensedetails',(req,res)=>{
    const sql="SELECT id,InvoiceNumber,CGST,Particulars,PaymentType,Amount,SGST,IGST,TotalAmount,DueDate,ActionDate from expense_table where  IsDeleted=0";
    db.query(sql,(err,data)=>{
        if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
        return res.json(data)
    })
})

app.put('/deletesingleexpenserecord/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`UPDATE expense_table SET IsDeleted=1 where id=${id}`
    db.query(sql,(err,data)=>{
        if(err){
        console.error("Error executing query: " + err.stack);
      return res.status(500).json({ error: "Database error" });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
        
    })
})

app.listen(8087,()=>{
    console.log("listening backend")
})