
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        let fileName = `${Date.now()}${ext}`;
        if (!ext) {
            if (file.mimetype === 'image/jpeg') {
                fileName += '.jpg';
            } else if (file.mimetype === 'image/png') {
                fileName += '.png';
            } else {
                return cb(new Error('Only image files are allowed.'));
            }
        }
        cb(null, fileName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only image files are allowed.'), false); 
        }
    },
});
const categoriesFilePath = './categories.json';
const productsFilePath = './products.json';

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
});

app.get('/api/categories', (req, res) => {
    fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла категорий');
        }
        res.json(JSON.parse(data));
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const updatedCategory = req.body;

    fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла категорий');
        }
        let categories = JSON.parse(data);
        categories = categories.map(category =>
            category.id === parseInt(id) ? { ...category, ...updatedCategory } : category
        );
        fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл категорий');
            }
            res.status(200).json(updatedCategory);
        });
    });
});
app.post('/api/categories', (req, res) => {
    const newCategory = req.body;

    if (!newCategory.name) {
        return res.status(400).send('Название категории обязательно');
    }

    fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла категорий');
        }
        let categories;
        try {
            categories = JSON.parse(data);  
        } catch (parseError) {
            return res.status(500).send('Ошибка парсинга данных категорий');
        }
        const newCategoryId = categories.length ? categories[categories.length - 1].id + 1 : 1;
        const categoryWithId = { id: newCategoryId, ...newCategory };
        categories.push(categoryWithId);

        fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл категорий');
            }
            res.status(201).json(categoryWithId);  
        });
    });
});
app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(categoriesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла категорий');
        }
        let categories = JSON.parse(data);
        categories = categories.filter(category => category.id !== parseInt(id));
        fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл категорий');
            }
            res.status(200).send({ message: 'Категория успешно удалена' });
        });
    });
});

app.get('/api/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла товаров' });
        }
        res.json(JSON.parse(data));
    });
});
app.post('/api/products', upload.single('img'), (req, res) => {
    const { name, categoryId, description } = req.body;
    const image = req.file;
    if (!name || !categoryId || !description || !image) {
        return res.status(400).json({ error:'Все поля обязательны'});
    }

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла товаров' });
        }

        const products =  JSON.parse(data || '[]');
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name,
            categoryId,
            description,
            image: `/uploads/${image.filename}`,
        };
        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи в файл товаров' });
            }
            res.status(201).json(newProduct);
        });
    });
});
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, categoryId, description } = req.body;
    const image = req.file;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла товаров' });
        }
        const products = JSON.parse(data);
        const productIndex = products.findIndex((product) => product.id === parseInt(id));
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        const updatedProduct = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            categoryId: categoryId || products[productIndex].categoryId,
            description: description || products[productIndex].description,
            image: image ? `/uploads/${image.filename}` : products[productIndex].image,
        };

        products[productIndex] = updatedProduct;

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка записи в файл товаров' });
            }
            res.status(200).json(updatedProduct);
        });
    });
});
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла товаров');
        }
        let products = JSON.parse(data);
        products = products.filter(product => product.id !== parseInt(id));

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл товаров');
            }
            res.status(200).send('Товар успешно удален');
        });
    });
});

app.listen(5000, () => {
    console.log('Сервер запущен на порту 5000');
});
