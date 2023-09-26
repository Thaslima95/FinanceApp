const puppeteer = require('puppeteer')
const fs = require('fs');

(async () => {
  // launch a new chrome instance
  const browser = await puppeteer.launch({
    headless: true
  })

  // create a new page
  const page = await browser.newPage()
              const response = await fetch('http://localhost:8087/getincomedetails');
            const data = await response.json();

  // set your html as the pages content
  // const html = fs.readFileSync(`D:/FinanceApp/frontend/src/pdffile2.html`, 'utf8')
const html=`<!doctypehtml><meta charset=utf-8><title>A simple, clean, and responsive HTML invoice template</title><style>table th{background:#000;color:#fff;text-align:center}.invoice-box{max-width:800px;margin:auto;padding:10px;border:1px solid #eee;box-shadow:0 0 10px rgba(0,0,0,.15);font-size:14px;line-height:20px;font-family:'Helvetica Neue',Helvetica,Helvetica,Arial,sans-serif;color:#000}.invoice-box table{width:100%;line-height:inherit;text-align:left}.invoice-box table td{padding:5px;vertical-align:top}.invoice-box table tr td:nth-child(2){text-align:right}.invoice-box table tr.top table td{padding-bottom:8px}.invoice-box table tr.top table td.title{font-size:45px;line-height:25px;color:#000}.invoice-box table tr.information table td{padding-bottom:8px}.invoice-box table tr.heading td{background:#eee;border-bottom:1px solid #ddd;font-weight:700}.invoice-box table tr.details td{padding-bottom:10px}.invoice-box table tr.item td{border-bottom:1px solid #eee}.invoice-box table tr.item.last td{border-bottom:none}.invoice-box table tr.total td:nth-child(2){border-top:2px solid #eee;font-weight:700}@media only screen and (max-width:600px){.invoice-box table tr.top table td{width:100%;display:block;text-align:center}.invoice-box table tr.information table td{width:100%;display:block;text-align:center}}.invoice-box.rtl{direction:rtl;font-family:Tahoma,'Helvetica Neue',Helvetica,Helvetica,Arial,sans-serif}.invoice-box.rtl table{text-align:right}.invoice-box.rtl table tr td:nth-child(2){text-align:left}</style><div class=invoice-box><table cellpadding=0 cellspacing=0><tr class=top><td colspan=2><table><tr><td class=title><img src=./logo.png style=width:100%;max-width:300px><td><br><span style=font-size:30px>TAX INVOICE</span><br><span>PS/<span id=psyear>${data[0].PSYear}</span><span id=invoiceid>/00${data[0].id}</span></span><br></table><tr class=information><td colspan=2><table><tr><td>Pyramidion Solutions Private Limited<br>308, 3rd Floor, Akshaya HQ, Kazhipattur,<br>Chennai ՞ 603103<br>+91 7845914589 Email: accounts@pyramidions.com<td>Balance Due<br><span id=balancedue>Rs.${data[0].BalanceDue}</span><br></table><tr class=information><td colspan=2><table><tr><td>Bill To<br><span id=companyname>${data[0].CompanyName}</span><br><span id=streetaddress>${data[0].StreetAddress}</span><br><span id=city>${data[0].City}</span><br><span id=state>TamilNadu</span> -<span id=pincode>${data[0].Pincode}</span><br>GSTIN <span id=gstin>${data[0].GSTIN}</span><td><table><br><br><br><br><tr><td>Invoice Date:<br>Terms:<br>Due Date:<td>${data[0].CreatedAt}<br><br>${data[0].DueDate}</table></table><tr class=information><td colspan=2><table><tr><td>Shipt To<br><br>Place Of Supply: <span id=placeofsupply>${data[0].PlaceofSupply}</span></table><tr class=information><table><th>#<th>Item & Description<th>HSN/SAC<th>Rate<th>CGST<th>SGST<th>IGST<th>Amount</th><tr><td>1<td id=items>${data[0].Items}<td id=hsnsac>${data[0].HSNSAC}<td id=rate>${data[0].Rate}<td id=cgst>${(data[0].CGST/100)*data[0].Amount}<br><span id=cgst>${data[0].CGST}</span><span>%</span><td id=sgst>${(data[0].SGST/100)*data[0].Amount}<br><span id=sgst>${data[0].SGST}</span><span>%</span><td id=igst>${(data[0].IGST/100)*data[0].Amount}<br><span id=igst>${data[0].IGST}</span><span>%</span><td id=amount>${data[0].Amount}</table></table></div><div class=invoice-box><table cellpadding=0 cellspacing=0><tr class=information><td colspan=2><table><tr><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><table><tr><td>Sub Total<br>CGST <span>(</span><span id=cgst>${data[0].CGST}</span><span>%)</span><br>SGST<span>(</span><span id=sgst>${data[0].SGST}</span><span>%)</span><br>IGST<span>(</span><span id=igst>${data[0].IGST}</span><span>%)</span><br>Total<br>Balance Due<td>12<br>${(data[0].CGST/100)*data[0].Amount}<br>${(data[0].SGST/100)*data[0].Amount}<br>${(data[0].IGST/100)*data[0].Amount}<br>totalvalue<br><span id=balancedue>${data[0].BalanceDue}</span></table></table><tr class=information><td colspan=2><table><tr><td>Notes<br>Payment Info via Bank transfer<br>Bank Name: ICICI Bank Nugapakkam Branch Chennai<br>Beneficiary Name: Pyramidion Solutions Private Limited<br>Account Details: Current A/c No. 000905027741 IFSC Code: ICIC0000009<br></table><tr class=information><td colspan=2><table><tr><td>Terms & Conditions<br>Thanks for your business.<br><hr>This is a system generated invoice and does not require signature</table></table></div>`
  await page.setContent(html, {
    waitUntil: 'domcontentloaded'
  })

  // create a pdf buffer
  const pdfBuffer = await page.pdf({
    format: 'A4'
  })

  // or a .pdf file
  await page.pdf({
    format: 'A4',
    path: `D:/FinanceApp/frontend/src/my-fance-invoice.pdf`
  })

  // close the browser
  await browser.close()
})()