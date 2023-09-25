const express=require('express')
const mysql=require('mysql')
const cors=require('cors')
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.json()) 


app.use(cors())

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
    return (data)
})
}



app.post('/addincome',(req,res)=>{
    console.log(req.body)
    const from=req.body.From;
      
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const prt=req.body.Prt;
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const status=req.body.Status;
    const details=req.body.Items;
    const sql="INSERT INTO income_table (`From`,DueDate,Prt,Amount,CGST,SGST,IGST,TotalAmount,`Status`,Items,ActionDate) VALUES ?";
    const value=[[from,duedate,prt,amount,cgst,sgst,igst,totalamount,status,details,actiondate]];
    const result=queryfunc(sql,value)
    return res.json(result)
})
app.put('/updateincome/:id',(req,res)=>{
const id=req.params.id;
  const from=req.body.From;
    const duedate = req.body.DueDate!=null ? new Date(req.body.DueDate).toISOString().slice(0, 19).replace('T', ' '):null;
    const actiondate =req.body.ActionDate!=null ? new Date(req.body.ActionDate).toISOString().slice(0, 19).replace('T', ' '):null; 
    const prt=req.body.Prt;
    const amount=req.body.Amount;
    const cgst=req.body.CGST;
    const sgst=req.body.SGST;
    const igst=req.body.IGST;
    const totalamount=req.body.TotalAmount;
    const status=req.body.Status;
    const details=req.body.Items;
const sql="UPDATE income_table SET `From`=?,DueDate=?,Prt=?,Amount=?,CGST=?,SGST=?,IGST=?,TotalAmount=?,`Status`=?,Items=?,ActionDate=? where id=?";
db.query(sql,[from,duedate,prt,amount,cgst,sgst,igst,totalamount,status,details,actiondate,id],(err,data)=>{
    if(err) throw err;
    return res.json(data)
})
})

app.get('/getTotalIncomeRate',(req,res)=>{
    const sql="Select sum(TotalAmount) as Total from income_table";
    db.query(sql,(err,data)=>{
        if(err) throw err;
        return res.json(data)
    })
})
app.get('/getincomedetails',(req,res)=>{
    console.log("income")
    const sql="Select * from income_table";
    db.query(sql,(err,data)=>{
        if(err) throw err;
        console.log(data)
        return res.json(data)
    })
})

app.listen(8087,()=>{
    console.log("listening backend")
})