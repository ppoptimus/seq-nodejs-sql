const soapRequest = require('easy-soap-request');

const url = 'http://www.example.com/exampleapi';
const sampleHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8'
};

const getFromDB4 = async (req,res) => {

   const xml = `<?xml version="1.0"?>
   <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
     <soap:Header>
     </soap:Header>
     <soap:Body>
       <GetUser>
         <UserId>123456</UserId>
       </GetUser>
     </soap:Body>
   </soap:Envelope>`;

   const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml });
  console.log(response.body);
}