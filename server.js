
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static('public'));

const db=mysql.createConnection({

    host: "localhost",
    user: "root",
    database: "products",
    password: "root1898",
})


db.connect((err)=>
{
    if(err){
        console.log(err)
    }
    else
    {
        console.log("Bağlandı")
    }
})

app.listen(PORT,()=>
{
    console.log(`Server ${PORT} portu uzerinden qosuldu`)
});


app.get("/", (req,res)=>
{
    res.render(
        "index")
})

app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM electronics';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Ürünleri getirirken hata oluştu: ', err);
      } else {
        res.render('products', { products: result });
      }
    });
  });

  app.get('/products/add', (req, res) => {
    res.render('add-product');
  });

  app.get('/products/edit/:id', (req, res) => {
      const productId = req.params.id;
      const sql = 'SELECT * FROM electronics WHERE id = ?';
      db.query(sql, [productId], (err, result) => {
        if (err) {
          console.error('Ürünü getirirken hata oluştu: ', err);
          res.redirect('/products'); 
        } else {
          const product = result[0];
          res.render('edit-product', { product });
        }
      });
  });


  app.post('/products/add', (req, res) => {
    const { title,brand,model,image,price,} = req.body;
    const sql = 'INSERT INTO electronics (title,brand,model,image,price,inBasket) VALUES (?, ?, ?, ?, ?, ?)';
  
    db.query(sql, [title,brand,model,image,price,0], (err, result) => {
      if (err) {
        console.error('Ürün eklerken hata oluştu: ', err);
      } else {
        res.redirect('/products');
      }
    });
  });

  app.post('/products/edit/:id', (req, res) => {
    const productId = req.params.id;
    const { title, brand, model, image, price, inBasket } = req.body;
  
    const sql = 'UPDATE electronics SET title = ?, brand = ?, model = ?, image = ?, price = ?, inBasket = ? WHERE id = ?';
    const values = [title, brand, model, image, price, 0, productId];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Ürünü güncellerken hata oluştu: ', err);
        res.redirect('/products'); 
      } else {
        res.redirect('/products');
      }
    });
  });
  

  app.post("/products",(req,res)=>
{
  console.log(req.body)
 db.query(
  `SELECT * FROM electronics WHERE title="${req.body.title}" OR brand="${req.body.title}" `  ,
 (err, results) => {
   if (!err) res.render('products',{products:results});
   else console.log(err);
 }
 )
})

app.get('/products/delete/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM electronics WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Ürünü silerken hata oluştu: ', err);
    } else {
      console.log('Ürün başarıyla silindi.');
    }
    res.redirect('/products'); 
  });
});

app.get("/api", (req, res) => {
    db.query("SELECT * from electronics", (err,results) => {
      res.send(results)
      if(err){
        console.log(err)
      }
      console.log(results)
    });
  });
