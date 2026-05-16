const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data.json";

// GET ALL LEADS
app.get("/api/leads", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  res.json(data);
});

// ADD LEAD
app.post("/api/leads", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));

  const newLead = {
    id: Date.now(),
    ...req.body
  };

  data.push(newLead);

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json(newLead);
});

// DELETE LEAD
app.delete("/api/leads/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE_PATH));

  data = data.filter(
    (lead) => lead.id != req.params.id
  );

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json({
    message: "Lead Deleted"
  });
});

// UPDATE LEAD
app.put("/api/leads/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE_PATH));

  data = data.map((lead) => {
    if (lead.id == req.params.id) {
      return {
        ...lead,
        ...req.body
      };
    }

    return lead;
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json({
    message: "Lead Updated"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});