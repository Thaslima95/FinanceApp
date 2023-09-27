const express=require('express')
const mysql=require('mysql')
const cors=require('cors')
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();


const generatepdf = new(require('./sample'))()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.json()) 


app.use(cors())
function generateShortRandomName() {
  const uuid = uuidv4();
  const shortName = uuid.replace(/-/g, '').substr(0, 10); // Adjust the length as needed
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

const queryfunc=(sql,values)=>{
db.query(sql,[values],(err,data)=>{
    if(err) throw err;
    return data;
})

}



app.post('/addincome',(req,res)=>{
    const companyname=req.body.CompanyName;
    const streetaddress=req.body.StreetAddress;
    const city=req.body.City;
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
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const balancedue=req.body.BalanceDue;
    const status=req.body.Status;
    const details=req.body.Items;
    const sql="INSERT INTO income_table (CompanyName,StreetAddress,City,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,Amount,CGST,SGST,IGST,TotalAmount,BalanceDue,`Status`,Items,ActionDate) VALUES ?";
    const value=[[companyname,streetaddress,city,pincode,placeofsupply,duedate,GSTN,GSTIN,particulars,psyear,hsnsac,rate,amount,cgst,sgst,igst,totalamount,balancedue,status,details,actiondate]];
    db.query(sql,[value],(err,data)=>{
    if(err) throw err;
     let id=data.insertId;
     req.body.id=id;
     const randomFilename = generateShortRandomName() + '.pdf';
    generatepdf.mypdf([req.body],randomFilename)
    const sql=`UPDATE income_table SET InvoiceFile='Invoice${randomFilename}' where id=${id}`
    db.query(sql,(err,data)=>{
        if(err) throw err;
         return res.json({"message":"Record Inserted"})
    })
      
})
    
})
app.put('/updateincome/:id',(req,res)=>{
    
const id=req.params.id;
const companyname=req.body.CompanyName;
    const streetaddress=req.body.StreetAddress;
    const city=req.body.City;
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
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const balancedue=req.body.BalanceDue;
    const status=req.body.Status;
    const details=req.body.Items;
const sql="UPDATE income_table SET CompanyName=?,StreetAddress=?,City=?,Pincode=?,PlaceofSupply=?,GSTN=?,GSTIN=?,Particulars=?,PSYear=?,HSNSAC=?,Rate=?,DueDate=?,Amount=?,CGST=?,SGST=?,IGST=?,TotalAmount=?,BalanceDue=?,`Status`=?,Items=?,ActionDate=? where id=?";
db.query(sql,[companyname,streetaddress,city,pincode,placeofsupply,GSTN,GSTIN,particulars,psyear,hsnsac,rate,duedate,amount,cgst,sgst,igst,totalamount,balancedue,status,details,actiondate,id],(err,data)=>{
    if(err) throw err;
     const randomFilename = generateShortRandomName() + '.pdf';
    generatepdf.mypdf([req.body],randomFilename)
    const sql=`UPDATE income_table SET InvoiceFile='Invoice${randomFilename}' where id=${id}`
    db.query(sql,(err,data)=>{
        if(err) throw err;
         return res.json({"message":"Updated Sucess"})
    })
   
})
})

app.get('/getTotalIncomeRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from income_table where Status='Paid' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})

app.get('/getUnpaidTotalIncomeRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from income_table where Status='UnPaid' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})


app.get('/getincomedetails',(req,res)=>{
   
    const sql="Select id,CompanyName,StreetAddress,City,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,Amount,CGST,SGST,IGST,TotalAmount,BalanceDue,`Status`,Items,ActionDate,CreatedAt from income_table where IsDeleted=0";
    db.query(sql,(err,data)=>{
        if(err) throw err;
       
        return res.json(data)
    })
})

app.get('/getsingleincomedetails/:id',(req,res)=>{
    
    const id=req.params.id;
    const sql=`Select id,CompanyName,StreetAddress,City,Pincode,PlaceofSupply,DueDate,GSTN,GSTIN,Particulars,PSYear,HSNSAC,Rate,Amount,CGST,SGST,IGST,TotalAmount,BalanceDue,Status,Items,ActionDate,CreatedAt from income_table where id=${id}`;
    db.query(sql,(err,data)=>{
        if(err) throw err;
        
        return res.json(data)
    })
})

app.put('/deletesinglerecord/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`UPDATE income_table SET IsDeleted=1 where id=${id}`
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})


app.post('/addexpense',(req,res)=>{
    
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
    const result=queryfunc(sql,value)
   
    return res.json(result)
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
    if(err) throw err;
    return res.json(data)
})
})


app.get('/getDirectTotalExpenseRate',(req,res)=>{
    const sql="Select sum(TotalAmount) as Total from expense_table where PaymentType='Direct' and IsDeleted=0";
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})

app.get('/getIndirectTotalExpenseRate',(req,res)=>{
    const sql=`Select sum(TotalAmount) as Total from expense_table where PaymentType='Indirect' and IsDeleted=0`;
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})
app.get('/getexpensedetails',(req,res)=>{
    const sql="SELECT id,InvoiceNumber,CGST,Particulars,PaymentType,Amount,SGST,IGST,TotalAmount,DueDate,ActionDate from expense_table where  IsDeleted=0";
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})

app.put('/deletesingleexpenserecord/:id',(req,res)=>{
    const id=req.params.id;
    const sql=`UPDATE expense_table SET IsDeleted=1 where id=${id}`
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})

app.listen(8087,()=>{
    console.log("listening backend")
})