const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  user: "sa",
  password: "Peisui@2433",
  server: "192.168.233.133",
  database: "seq",
  options: {
    encrypt: false,
    port: 1433,
  },
};

app.post("/get", async (req, res) => {
    const employer_account = req.body.employer_account === null? null: req.bodymployer_account.toString();
    const refference_id = req.body.refference_id === null? null: req.body.refference_id.toString();
    const first_name = req.body.first_name === null ? null : req.body.first_name.toString();
    const last_name = req.body.last_name === null ? null : req.body.last_name.toString();
    const company_name = req.body.company_name === null ? null : req.body.company_name.toString();
    const from_date = req.body.from_date === null ? null : req.body.from_date.toString();
    const to_date = req.body.to_date === null ? null : req.body.to_date.toString();
    const address = req.body.address === null ? null : req.body.address.toString();
    const remark = req.body.remark === null ? null : req.body.remark.toString();
    const department_id = req.body.department_id;
    const create_by = req.body.create_by === null ? null : req.body.create_by.toString();
    const update_by = req.body.update_by === null ? null : req.body.update_by.toString();
  const qryString = `EXEC [dbo].[sp_get_request_detail]
    @p_employer_account = ${employer_account},
    @p_refference_id = ${refference_id},
    @p_first_name = ${first_name},
    @p_last_name = ${last_name},
    @p_company_name = ${company_name},
    @p_from_date = ${from_date},
    @p_to_date = ${to_date},
    @p_address = ${address},
    @p_remark = ${remark},
    @p_department_id = ${department_id},
    @p_create_by = ${create_by},
    @p_update_by = ${update_by}`;

  console.log(qryString);
  sql.connect(config, function (err) {
    var request = new sql.Request();

    request.query(qryString, async function (err, result) {
      if (err) {
        await res.json({ message: "error", description: err });
      } else {
        await res.json(result.recordset);
      }
    });
  });
});

app.listen(5000, () => {
  console.log("Application is running on port 5000");
});
